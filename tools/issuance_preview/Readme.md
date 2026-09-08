# Learning Tokens Python tools: issuance preview

This directory contains a dependency-free Python feature for the Learning Tokens repository: an **issuance preview** engine that turns a normalized LMS payload from `npm_package ltsdk` into deterministic Learning Token issuance candidates before any blockchain mint or transfer.

## Package layout

```text
tools/issuance_preview/
├── learning_tokens_issuance/
│   ├── preview.py                           # issuance preview engine and CLI
│   └── __init__.py
└── tests/
    └── test_preview.py
```

## Issuance policy format

A policy contains the target course, optional learner wallet mappings, and token rules. Each rule describes a token type, an amount, optional assignment filters, and a condition over normalized LMS evidence.

```json
{
  "courseId": "1001",
  "wallets": {
    "21": "0x1111111111111111111111111111111111111111"
  },
  "tokens": [
    {
      "id": "attendance-submitted",
      "tokenType": "attendance",
      "amount": 1,
      "condition": {
        "field": "submission.workflow_state",
        "equals": "submitted"
      }
    },
    {
      "id": "score-above-80",
      "tokenType": "score",
      "amount": 10,
      "condition": {
        "field": "grade.percentage",
        "gte": 80
      }
    }
  ]
}
```

Conditions support `equals`, `notEquals`, `in`, `gt`, `gte`, `lt`, `lte`, `exists`, and nested `all` / `any` groups. Field paths are evaluated against `course`, `learner`, `assignment`, `submission`, and `grade` records from the normalized payload.

## CLI examples

### Preview Learning Token issuance

```bash
python3 -m tools.issuance_preview.learning_tokens_issuance preview \
  --payload npm_package\ ltsdk/tests/fixtures/moodle-normalized.json \
  --policy /path/to/policy.json \
  --pretty
```

The previous top-level form is still supported for compatibility:

```bash
python3 -m tools.issuance_preview.learning_tokens_issuance \
  --payload npm_package\ ltsdk/tests/fixtures/moodle-normalized.json \
  --policy /path/to/policy.json \
  --pretty
```

## Python API

```python
from tools.issuance_preview.learning_tokens_issuance import build_preview

payload = {...}  # normalized LMS payload from LTSDK
policy = {...}   # scoring-guide-style token rules

print(build_preview(payload, policy))
```

## Test

```bash
python3 -m unittest discover -s tools/issuance_preview/tests
```