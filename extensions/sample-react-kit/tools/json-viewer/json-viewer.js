// Parses the text and hands the value to the React tree as is: values of
// extension components are plain JSON.
const countNodes = (value) => {
  if (Array.isArray(value)) return value.reduce((total, item) => total + countNodes(item), 1)
  if (value && typeof value === "object") return Object.values(value).reduce((total, item) => total + countNodes(item), 1)
  return 1
}

export default function jsonViewer({ json }) {
  if (!json?.trim()) {
    return { tree: undefined, summary: "" }
  }

  const value = JSON.parse(json)
  return { tree: value, summary: `${countNodes(value)} nodes` }
}
