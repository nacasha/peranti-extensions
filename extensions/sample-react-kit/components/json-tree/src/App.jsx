import { useState } from "react"

import { usePeranti } from "./usePeranti.js"

const typeOf = (value) => {
  if (value === null) return "null"
  if (Array.isArray(value)) return "array"
  return typeof value
}

const Value = ({ value }) => {
  const type = typeOf(value)
  const text = type === "string" ? JSON.stringify(value) : String(value)
  return <span className={`value is-${type}`}>{text}</span>
}

const Node = ({ name, value, depth, openDepth }) => {
  const type = typeOf(value)
  const isBranch = type === "array" || type === "object"
  const [isOpen, setIsOpen] = useState(depth < openDepth)
  const label = name !== undefined && <span className="key">{name}</span>

  if (!isBranch) {
    return (
      <div className="row">
        <span className="toggle" />
        {label}
        <Value value={value} />
      </div>
    )
  }

  const entries = Object.entries(value)

  return (
    <div>
      <button type="button" className="row is-branch" onClick={() => { setIsOpen(!isOpen) }}>
        <span className={`toggle ${isOpen ? "is-open" : ""}`}>▸</span>
        {label}
        <span className="meta">{type === "array" ? `[${entries.length}]` : `{${entries.length}}`}</span>
      </button>

      {isOpen && (
        <div className="children">
          {entries.map(([key, child]) => (
            <Node key={key} name={key} value={child} depth={depth + 1} openDepth={openDepth} />
          ))}
        </div>
      )}
    </div>
  )
}

export const App = () => {
  const { value, props } = usePeranti()
  const initialDepth = props.expandDepth ?? 2

  // Expand and collapse all remount the tree with a new starting depth, so
  // each node can still be toggled on its own afterwards
  const [view, setView] = useState({ openDepth: initialDepth, key: 0 })
  const showDepth = (openDepth) => { setView({ openDepth, key: view.key + 1 }) }

  if (value === undefined) {
    return <div className="empty">Run the tool to see the tree</div>
  }

  return (
    <div className="tree">
      <div className="toolbar">
        <button type="button" onClick={() => { showDepth(Infinity) }}>Expand all</button>
        <button type="button" onClick={() => { showDepth(1) }}>Collapse all</button>
      </div>
      <Node key={view.key} value={value} depth={0} openDepth={view.openDepth} />
    </div>
  )
}
