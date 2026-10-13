export default function reverseLines({ text }) {
  return {
    result: (text ?? "").split("\n").reverse().join("\n")
  }
}
