#!/usr/bin/env bash
# Input values arrive as JSON on stdin; the result is printed as JSON on stdout.
# Needs jq on PATH.
input=$(cat)

a=$(jq -r '.a // 0' <<<"$input")
b=$(jq -r '.b // 0' <<<"$input")
op=$(jq -r '.op // "+"' <<<"$input")

result=$(awk -v a="$a" -v b="$b" -v op="$op" 'BEGIN {
  if (op == "+") print a + b
  else if (op == "-") print a - b
  else if (op == "*") print a * b
  else if (op == "/") { if (b == 0) print "Division by zero"; else print a / b }
}')

jq -n --arg result "$result" --arg expression "$a $op $b" \
  '{result: $result, expression: $expression}'
