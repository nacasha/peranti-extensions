// An input component: reads its value with peranti.onValue and writes it with
// peranti.setValue. The value is { hue, lightness }, as documented in
// peranti.component.json. Its field's "props" arrive as peranti.props.
const canvas = document.getElementById("wheel")
const context = canvas.getContext("2d")
const swatch = document.getElementById("swatch")
const hexLabel = document.getElementById("hex")
const lightnessInput = document.getElementById("lightness")

const size = canvas.width
const center = size / 2
const radius = size / 2

let current = { hue: 200, lightness: 55 }

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

const draw = () => {
  context.clearRect(0, 0, size, size)

  for (let angle = 0; angle < 360; angle += 1) {
    const start = (angle - 90.6) * Math.PI / 180
    const end = (angle - 89.4) * Math.PI / 180
    context.beginPath()
    context.moveTo(center, center)
    context.arc(center, center, radius, start, end)
    context.closePath()
    context.fillStyle = `hsl(${angle}, 80%, ${current.lightness}%)`
    context.fill()
  }

  // Hole in the middle, so it reads as a ring
  context.globalCompositeOperation = "destination-out"
  context.beginPath()
  context.arc(center, center, radius * 0.55, 0, Math.PI * 2)
  context.fill()
  context.globalCompositeOperation = "source-over"

  // Marker on the picked hue
  const markerAngle = (current.hue - 90) * Math.PI / 180
  const markerRadius = radius * 0.78
  context.beginPath()
  context.arc(center + Math.cos(markerAngle) * markerRadius, center + Math.sin(markerAngle) * markerRadius, 8, 0, Math.PI * 2)
  context.lineWidth = 3
  context.strokeStyle = "#fff"
  context.stroke()

  const hex = toHex(current.hue, current.lightness)
  swatch.style.background = hex
  hexLabel.textContent = hex
  lightnessInput.value = current.lightness
}

const pickFromPointer = (event) => {
  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left) * (size / rect.width) - center
  const y = (event.clientY - rect.top) * (size / rect.height) - center
  const hue = Math.round((Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360)

  current = { ...current, hue }
  draw()
  peranti.setValue(current)
}

canvas.addEventListener("pointerdown", (event) => {
  canvas.setPointerCapture(event.pointerId)
  pickFromPointer(event)
})
canvas.addEventListener("pointermove", (event) => {
  if (canvas.hasPointerCapture(event.pointerId)) pickFromPointer(event)
})

lightnessInput.addEventListener("input", () => {
  current = { ...current, lightness: Number(lightnessInput.value) }
  draw()
  peranti.setValue(current)
})

// Called with the stored value when the tab opens, and on every change from
// the app, such as loading a sample
peranti.onValue((value) => {
  if (value && typeof value.hue === "number") {
    current = { hue: value.hue, lightness: value.lightness ?? 55 }
  }
  document.body.classList.toggle("read-only", peranti.readOnly)
  // Without the slider, lightness keeps whatever the value holds
  document.getElementById("lightness-control").hidden = peranti.props.showLightness === false
  draw()
})

draw()
