// Input values arrive as JSON on stdin; the result is printed as JSON on stdout.
let data = ""

process.stdin.on("data", (chunk) => {
  data += chunk
})

process.stdin.on("end", () => {
  const input = JSON.parse(data)
  const text = input.text ?? ""

  console.log(JSON.stringify({
    upper: text.toUpperCase(),
    length: String(text.length)
  }))
})
