import json
import sys

# Input values arrive as JSON on stdin; the result is printed as JSON on stdout.
data = json.load(sys.stdin)

text = data.get("text") or ""
mode = data.get("mode") or "upper"
separator = data.get("separator") or ""

try:
    repeat = max(1, int(float(data.get("repeat") or 1)))
except ValueError:
    repeat = 1

transforms = {
    "upper": str.upper,
    "lower": str.lower,
    "title": str.title,
    "reverse": lambda value: value[::-1],
}

transformed = transforms.get(mode, str)(text)

print(json.dumps({
    "result": separator.join([transformed] * repeat),
    "words": str(len(text.split())),
    "chars": str(len(text)),
}))
