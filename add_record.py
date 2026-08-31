"""
Groundline v1：低摩擦的append工具，用CLI快速把一筆新記錄寫進data.json。
不做任何驗證/推論——AI自己判斷evidence類型，這支腳本只負責忠實寫入。
用法：
  python add_record.py --channel "裏索內司會議室" --claim "..." --evidence verified --note "..."
evidence只能是：verified / inferred_wrong / uncertain / subjective / self_report
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DATA_FILE = Path(__file__).parent / "data.json"
VALID_EVIDENCE = {"verified", "inferred_wrong", "uncertain", "subjective", "self_report"}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--channel", required=True)
    parser.add_argument("--claim", required=True)
    parser.add_argument("--evidence", required=True, choices=sorted(VALID_EVIDENCE))
    parser.add_argument("--note", default="")
    parser.add_argument("--message-id", default="")
    args = parser.parse_args()

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    record = {
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "message_id": args.message_id,
        "channel": args.channel,
        "claim": args.claim,
        "evidence": args.evidence,
        "note": args.note,
    }
    data["records"].append(record)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"appended: [{args.evidence}] {args.claim}")


if __name__ == "__main__":
    main()
