// The notepads' values are the texts, the letter bars draw the list this
// returns. Letters in `skip` are left out.
export default function countLetters({ text, skip }) {
  const skipped = new Set(String(skip ?? "").toLowerCase())
  const counts = new Map()

  for (const character of String(text ?? "").toLowerCase()) {
    if (character >= "a" && character <= "z" && !skipped.has(character)) {
      counts.set(character, (counts.get(character) ?? 0) + 1)
    }
  }

  return {
    bars: [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, count]) => ({ letter, count }))
  }
}
