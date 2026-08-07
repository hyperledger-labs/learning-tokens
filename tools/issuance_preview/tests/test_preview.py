import json
import tempfile
import unittest
from pathlib import Path

from tools.issuance_preview.learning_tokens_issuance import build_preview, main
from tools.issuance_preview.learning_tokens_issuance.preview import PolicyError

ROOT = Path(__file__).resolve().parents[3]
FIXTURE = ROOT / "npm_package ltsdk" / "tests" / "fixtures" / "moodle-normalized.json"


class IssuancePreviewTests(unittest.TestCase):
    def setUp(self):
        self.payload = json.loads(FIXTURE.read_text(encoding="utf-8"))
        self.policy = {
            "courseId": "1001",
            "wallets": {"21": "0x1111111111111111111111111111111111111111"},
            "tokens": [
                {
                    "id": "attendance-submitted",
                    "tokenType": "attendance",
                    "amount": 1,
                    "condition": {"field": "submission.workflow_state", "equals": "submitted"},
                },
                {
                    "id": "score-above-80",
                    "tokenType": "score",
                    "amount": 10,
                    "condition": {"field": "grade.percentage", "gte": 80},
                },
            ],
        }

    def test_builds_preview_from_normalized_moodle_payload(self):
        preview = build_preview(self.payload, self.policy)

        self.assertEqual(preview["course"]["id"], "1001")
        self.assertEqual(preview["summary"]["totalIssuances"], 2)
        self.assertEqual(preview["summary"]["totalAmountByTokenType"], {"attendance": 1, "score": 10})
        self.assertEqual(preview["diagnostics"], [])
        self.assertEqual(preview["issuances"][0]["walletAddress"], "0x1111111111111111111111111111111111111111")
        self.assertEqual(preview["issuances"][1]["evidence"]["percentage"], "90.00")

    def test_reports_missing_wallet_without_blocking_review(self):
        policy = {**self.policy, "wallets": {}}
        preview = build_preview(self.payload, policy)

        self.assertEqual(preview["summary"]["totalIssuances"], 2)
        self.assertEqual({item["code"] for item in preview["diagnostics"]}, {"missing_wallet"})
        self.assertIsNone(preview["issuances"][0]["walletAddress"])

    def test_rejects_policy_for_wrong_course(self):
        policy = {**self.policy, "courseId": "another-course"}

        with self.assertRaises(PolicyError):
            build_preview(self.payload, policy)

    def test_cli_writes_preview_file(self):
        with tempfile.TemporaryDirectory() as tmp:
            policy_path = Path(tmp) / "policy.json"
            out_path = Path(tmp) / "preview.json"
            policy_path.write_text(json.dumps(self.policy), encoding="utf-8")

            exit_code = main(["--payload", str(FIXTURE), "--policy", str(policy_path), "--out", str(out_path), "--pretty"])

            self.assertEqual(exit_code, 0)
            preview = json.loads(out_path.read_text(encoding="utf-8"))
            self.assertEqual(preview["summary"]["totalIssuances"], 2)


if __name__ == "__main__":
    unittest.main()
