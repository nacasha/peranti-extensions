// Each tool has its own entry file, resolved next to its peranti.tool.json:
// receive the input values, return the outputs.
export default function slugify({ text }) {
  const slug = (text ?? "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return { slug }
}
