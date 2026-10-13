// `tags` is the list of strings the tag editor sets
const toHashtag = (tag) => `#${tag.trim().replace(/\s+(\w)/g, (_, letter) => letter.toUpperCase()).replace(/[^\p{L}\p{N}_]/gu, "")}`

export default function hashtags({ tags }) {
  const list = Array.isArray(tags) ? tags.filter((tag) => typeof tag === "string" && tag.trim()) : []

  return {
    hashtags: list.map(toHashtag).join(" "),
    count: `${list.length} tag${list.length === 1 ? "" : "s"}`
  }
}
