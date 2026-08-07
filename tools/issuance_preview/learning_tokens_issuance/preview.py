"""Build deterministic Learning Token issuance previews from normalized LMS data.

The Learning Tokens repository already normalizes LMS records in the TypeScript
SDK.  This Python module adds a small, dependency-free policy engine that turns
that normalized evidence into a reviewable issuance plan before any blockchain
transaction is sent.
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Mapping

Context = Mapping[str, Any]


class PolicyError(ValueError):
    """Raised when an issuance policy cannot be evaluated safely."""


def load_json(path: str | Path) -> Any:
    """Load a JSON file using UTF-8 encoding."""

    with Path(path).open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _as_decimal(value: Any) -> Decimal | None:
    if value is None or value == "":
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None


def _lookup(context: Context, dotted_path: str) -> Any:
    current: Any = context
    for part in dotted_path.split("."):
        if isinstance(current, Mapping):
            current = current.get(part)
        else:
            current = getattr(current, part, None)
        if current is None:
            return None
    return current


def _compare(actual: Any, condition: Mapping[str, Any]) -> bool:
    if "exists" in condition:
        return (actual is not None) is bool(condition["exists"])

    if "equals" in condition and actual != condition["equals"]:
        return False
    if "notEquals" in condition and actual == condition["notEquals"]:
        return False
    if "in" in condition and actual not in condition["in"]:
        return False

    numeric_ops = {
        "gt": lambda left, right: left > right,
        "gte": lambda left, right: left >= right,
        "lt": lambda left, right: left < right,
        "lte": lambda left, right: left <= right,
    }
    for op, predicate in numeric_ops.items():
        if op not in condition:
            continue
        left = _as_decimal(actual)
        right = _as_decimal(condition[op])
        if left is None or right is None or not predicate(left, right):
            return False

    return True


def _matches(condition: Mapping[str, Any] | None, context: Context) -> bool:
    if not condition:
        return True
    if "all" in condition:
        return all(_matches(child, context) for child in condition["all"])
    if "any" in condition:
        return any(_matches(child, context) for child in condition["any"])

    field = condition.get("field")
    if not field:
        raise PolicyError("Each leaf condition must define a field")
    return _compare(_lookup(context, str(field)), condition)


def _iter_grade_contexts(payload: Mapping[str, Any]):
    course = payload.get("course") or {}
    for learner in payload.get("learners") or []:
        for assignment in learner.get("assignments") or payload.get("assignments") or []:
            submissions = assignment.get("submissions") or [None]
            for submission in submissions:
                grades = (submission or {}).get("grades") or [None]
                for grade in grades:
                    yield {
                        "course": course,
                        "learner": learner,
                        "assignment": assignment,
                        "submission": submission or {},
                        "grade": grade or {},
                    }


def _evidence_for(context: Context, condition: Mapping[str, Any] | None) -> dict[str, Any]:
    fields: list[str] = []

    def collect(cond: Mapping[str, Any] | None) -> None:
        if not cond:
            return
        if "field" in cond:
            fields.append(str(cond["field"]))
        for key in ("all", "any"):
            for child in cond.get(key, []) or []:
                collect(child)

    collect(condition)
    evidence = {field: _lookup(context, field) for field in fields}
    assignment = context.get("assignment") or {}
    submission = context.get("submission") or {}
    grade = context.get("grade") or {}
    evidence.update(
        {
            "assignmentId": assignment.get("id"),
            "assignmentTitle": assignment.get("title"),
            "submittedAt": submission.get("submitted_at"),
            "score": grade.get("score"),
            "totalScore": grade.get("totalscore"),
            "percentage": grade.get("percentage"),
        }
    )
    return {key: value for key, value in evidence.items() if value is not None}


def build_preview(payload: Mapping[str, Any], policy: Mapping[str, Any]) -> dict[str, Any]:
    """Return a deterministic token issuance preview.

    The policy format intentionally mirrors scoring-guide language: each token
    rule has a token type, amount, optional assignment filters, and a condition
    evaluated against normalized LMS records.
    """

    wallets = policy.get("wallets") or {}
    rules = policy.get("tokens") or []
    if not isinstance(rules, list) or not rules:
        raise PolicyError("Policy must include a non-empty tokens list")

    course = payload.get("course") or {}
    source = payload.get("source") or {}
    expected_course_id = policy.get("courseId")
    if expected_course_id and str(course.get("id")) != str(expected_course_id):
        raise PolicyError(
            f"Policy courseId {expected_course_id!r} does not match payload course id {course.get('id')!r}"
        )

    issuances: list[dict[str, Any]] = []
    diagnostics: list[dict[str, Any]] = []

    for rule_index, rule in enumerate(rules):
        token_type = rule.get("tokenType") or rule.get("type")
        if not token_type:
            raise PolicyError(f"Token rule at index {rule_index} must define tokenType")
        amount = rule.get("amount", 1)
        assignment_ids = {str(item) for item in rule.get("assignmentIds", [])}
        condition = rule.get("condition")

        for context in _iter_grade_contexts(payload):
            assignment = context["assignment"]
            if assignment_ids and str(assignment.get("id")) not in assignment_ids:
                continue
            if not _matches(condition, context):
                continue

            learner = context["learner"]
            learner_id = str(learner.get("id") or learner.get("username") or learner.get("email") or "")
            wallet = wallets.get(learner_id) or wallets.get(learner.get("email")) or wallets.get(learner.get("username"))
            if not wallet:
                diagnostics.append(
                    {
                        "level": "warning",
                        "code": "missing_wallet",
                        "learnerId": learner_id,
                        "message": "Learner matched an issuance rule but no wallet address was provided.",
                    }
                )

            issuances.append(
                {
                    "courseId": str(course.get("id")),
                    "sourceLms": source.get("lms"),
                    "learnerId": learner_id,
                    "learnerName": learner.get("name"),
                    "walletAddress": wallet,
                    "tokenType": token_type,
                    "amount": amount,
                    "ruleId": rule.get("id") or f"rule-{rule_index + 1}",
                    "evidence": _evidence_for(context, condition),
                }
            )

    totals: dict[str, Any] = defaultdict(lambda: 0)
    for issuance in issuances:
        totals[str(issuance["tokenType"])] += issuance["amount"]

    return {
        "course": {
            "id": str(course.get("id")),
            "name": course.get("name"),
        },
        "source": source,
        "summary": {
            "totalIssuances": len(issuances),
            "totalAmountByTokenType": dict(sorted(totals.items())),
        },
        "issuances": issuances,
        "diagnostics": diagnostics,
    }


def _add_output_flags(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--out", help="Optional output path; stdout is used when omitted")
    parser.add_argument("--pretty", action="store_true", help="Pretty-print JSON output")


def _parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Learning Tokens Python tools for issuance previews."
    )
    subparsers = parser.add_subparsers(dest="command")

    preview_parser = subparsers.add_parser(
        "preview",
        help="Build a Learning Token issuance preview from normalized LMS JSON.",
    )
    preview_parser.add_argument("--payload", required=True, help="Path to normalized LMS payload JSON")
    preview_parser.add_argument("--policy", required=True, help="Path to issuance policy JSON")
    _add_output_flags(preview_parser)

    # Backward compatibility for the first revision of this tool, which accepted
    # --payload/--policy at the top level without an explicit subcommand.
    parser.add_argument("--payload", help=argparse.SUPPRESS)
    parser.add_argument("--policy", help=argparse.SUPPRESS)
    _add_output_flags(parser)
    return parser.parse_args(argv)


def _write_json(payload: Mapping[str, Any], *, pretty: bool = False, out: str | None = None) -> None:
    body = json.dumps(payload, indent=2 if pretty else None, sort_keys=True)
    if out:
        Path(out).write_text(body + "\n", encoding="utf-8")
    else:
        print(body)


def main(argv: list[str] | None = None) -> int:
    args = _parse_args(argv)
    command = args.command or ("preview" if args.payload and args.policy else None)
    if command is None:
        _parse_args(["--help"])
        return 2

    if command == "preview":
        result = build_preview(load_json(args.payload), load_json(args.policy))
    else:
        raise PolicyError(f"Unknown command: {command}")

    _write_json(result, pretty=args.pretty, out=args.out)
    return 0