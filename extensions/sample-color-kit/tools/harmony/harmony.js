// Values from extension components are plain JSON: `base` is the
// { hue, lightness } the hue wheel sets, `palette` is the list the palette
// strip draws.
const toHex = (hue, lightness) => {
  const s = 0.8
  const l = lightness / 100
  const a = s * Math.min(l, 1 - l)
  const channel = (n) => {
    const k = (n + hue / 30) % 12
    const value = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return Math.round(value * 255).toString(16).padStart(2, "0")
  }
  return `#${channel(0)}${channel(8)}${channel(4)}`
}

const offsets = {
  complementary: [["Base", 0], ["Complement", 180]],
  triadic: [["Base", 0], ["Second", 120], ["Third", 240]],
  analogous: [["Left", -30], ["Base", 0], ["Right", 30]]
}

export default function harmony({ base, scheme }) {
  const hue = typeof base?.hue === "number" ? base.hue : 200
  const lightness = typeof base?.lightness === "number" ? base.lightness : 55

  const palette = (offsets[scheme] ?? offsets.triadic).map(([name, offset]) => ({
    name,
    hex: toHex((hue + offset + 360) % 360, lightness)
  }))

  return {
    palette,
    hexes: palette.map((color) => color.hex).join(", ")
  }
}
