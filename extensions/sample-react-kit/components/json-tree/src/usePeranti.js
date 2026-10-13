import { useEffect, useState } from "react"

/**
 * The field's value and props from the bridge Peranti puts in the frame,
 * read again on every change
 */
export function usePeranti() {
  const [value, setValue] = useState(() => window.peranti.value)

  useEffect(() => window.peranti.onValue((next) => { setValue(next) }), [])

  return { value, props: window.peranti.props }
}
