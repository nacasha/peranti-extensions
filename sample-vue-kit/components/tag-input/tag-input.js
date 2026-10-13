// window.peranti is the bridge Peranti puts in the frame, Vue the global
// the runtime build defines
const { createApp, h, ref, onMounted, onUnmounted, nextTick } = Vue

const TagInput = {
  setup() {
    const tags = ref(Array.isArray(peranti.value) ? peranti.value : [])
    const draft = ref("")
    const input = ref()
    const { placeholder = "Add a tag…", lowercase = false } = peranti.props

    let unsubscribe
    onMounted(() => {
      unsubscribe = peranti.onValue((value) => { tags.value = Array.isArray(value) ? value : [] })
    })
    onUnmounted(() => { unsubscribe?.() })

    const save = (next) => {
      tags.value = next
      peranti.setValue(next)
    }

    const add = () => {
      let tag = draft.value.trim().replace(/,$/, "").trim()
      if (lowercase) tag = tag.toLowerCase()
      draft.value = ""
      if (tag && !tags.value.includes(tag)) save([...tags.value, tag])
    }

    const remove = (index) => {
      save(tags.value.filter((_, tagIndex) => tagIndex !== index))
      nextTick(() => { input.value?.focus() })
    }

    const handleKeydown = (event) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault()
        add()
      } else if (event.key === "Backspace" && !draft.value && tags.value.length > 0) {
        remove(tags.value.length - 1)
      }
    }

    return () => {
      const readOnly = peranti.readOnly

      return h("div", { class: ["tags", readOnly && "is-readonly"], onClick: () => { input.value?.focus() } }, [
        ...tags.value.map((tag, index) => h("span", { class: "tag", key: tag }, [
          tag,
          !readOnly && h("button", {
            type: "button",
            class: "remove",
            "aria-label": `Remove ${tag}`,
            onClick: (event) => { event.stopPropagation(); remove(index) }
          }, "×")
        ])),
        !readOnly && h("input", {
          ref: input,
          class: "draft",
          value: draft.value,
          placeholder: tags.value.length === 0 ? placeholder : "",
          onInput: (event) => { draft.value = event.target.value },
          onKeydown: handleKeydown,
          onBlur: add
        })
      ])
    }
  }
}

createApp(TagInput).mount("#app")
