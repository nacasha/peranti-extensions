import json
import sys

# Input values of this tool arrive as JSON on stdin, like any executable tool.
data = json.load(sys.stdin)
text = data.get("text") or ""

print(json.dumps({
    "words": str(len(text.split())),
    "lines": str(len(text.splitlines()) if text else 0),
    "chars": str(len(text)),
}))
