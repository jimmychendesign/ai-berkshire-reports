#!/usr/bin/env python3
import argparse
import json
import re
from pathlib import Path


NUMBER_RE = re.compile(r"(?<![\w.])[-+]?\$?\d[\d,]*(?:\.\d+)?\s*(?:亿|万|B|M|%|美元|USD)?")


def extract(args):
    text = Path(args.report).read_text(encoding="utf-8")
    matches = NUMBER_RE.findall(text)
    sample_size = max(1, round(len(matches) * 0.15))
    step = max(1, len(matches) // sample_size)
    sample = matches[::step][:sample_size]
    payload = [
        {
            "reported_value": value.strip(),
            "reported_source": "",
            "fetched_value": "",
            "fetched_source": "",
            "fetched_value2": "",
            "fetched_source2": "",
            "verdict": "pending",
        }
        for value in sample
    ]
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def verdict(args):
    rows = json.loads(args.results)
    failed = [row for row in rows if row.get("verdict") not in {"ok", "OK", "pass", "PASS", "准出"}]
    status = "准出" if not failed else "打回"
    print(json.dumps({
        "report": args.report,
        "status": status,
        "checked_items": len(rows),
        "failed_items": len(failed),
        "failures": failed,
    }, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("extract")
    p.add_argument("--report", required=True)
    p.set_defaults(func=extract)
    p = sub.add_parser("verdict")
    p.add_argument("--results", required=True)
    p.add_argument("--report", required=True)
    p.set_defaults(func=verdict)
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
