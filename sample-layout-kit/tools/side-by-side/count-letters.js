// The notepad's value is the text, the letter bars
// draw the list this returns
export default function countLetters({ text }) {
  const counts = new Map()

  for (const character of String(text ?? "").toLowerCase()) {
    if (character >= "a" && character <= "z") {
      counts.set(character, (counts.get(character) ?? 0) + 1)
    }
  }

  return {
    bars: [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, count]) => ({ letter, count }))
  }
}
