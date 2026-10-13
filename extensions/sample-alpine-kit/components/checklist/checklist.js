// Registered before Alpine starts. window.peranti is the bridge Peranti puts
// in the frame. The CSP build can't evaluate expressions, so every value the
// template shows is a property or getter here.
document.addEventListener("alpine:init", () => {
  let nextId = 1
  const withIds = (list) => (Array.isArray(list) ? list : [])
    .filter((item) => item && typeof item.label === "string")
    .map((item) => ({ id: nextId++, label: item.label, done: !!item.done }))

  Alpine.data("checklist", () => ({
    items: withIds(peranti.value),
    draft: "",
    readOnly: peranti.readOnly,

    init() {
      peranti.onValue((value) => {
        this.items = withIds(value)
        this.readOnly = peranti.readOnly
      })
    },

    get canEdit() {
      return !this.readOnly
    },

    get doneCount() {
      return this.items.filter((item) => item.done).length
    },

    get countLabel() {
      return `${this.doneCount} / ${this.items.length}`
    },

    get fillStyle() {
      const percent = this.items.length ? (this.doneCount / this.items.length) * 100 : 0
      return `width: ${percent}%`
    },

    save() {
      peranti.setValue(this.items.map(({ label, done }) => ({ label, done })))
    },

    add() {
      const label = this.draft.trim()
      if (!label) return
      this.items.push({ id: nextId++, label, done: false })
      this.draft = ""
      this.save()
    },

    // `this.item` is the item of the x-for row the event came from
    toggle() {
      this.item.done = !this.item.done
      this.save()
    },

    remove() {
      this.items = this.items.filter((item) => item.id !== this.item.id)
      this.save()
    }
  }))
})
