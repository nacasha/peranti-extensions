// `items` is the list of { label, done } the checklist sets
export default function progress({ items }) {
  const list = Array.isArray(items) ? items.filter((item) => item?.label) : []
  const done = list.filter((item) => item.done).length
  const percent = list.length ? Math.round((done / list.length) * 100) : 0

  return {
    progress: `${done} of ${list.length} done (${percent}%)`,
    remaining: list.filter((item) => !item.done).map((item) => `- ${item.label}`).join("\n")
  }
}
