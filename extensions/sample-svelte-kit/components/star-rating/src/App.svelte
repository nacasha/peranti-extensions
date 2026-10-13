<script>
  // window.peranti is the bridge Peranti puts in the frame
  const { peranti } = window

  let rating = $state(Number(peranti.value) || 0)
  let hovered = $state(0)
  const max = Math.max(1, Number(peranti.props.max) || 5)

  $effect(() => peranti.onValue((value) => { rating = Number(value) || 0 }))

  const pick = (stars) => {
    if (peranti.readOnly) return
    // Picking the current rating again clears it
    rating = stars === rating ? 0 : stars
    peranti.setValue(rating)
  }

  const handleKeydown = (event) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") pick(Math.min(max, rating + 1))
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") pick(Math.max(0, rating - 1))
  }

  const shown = $derived(hovered || rating)
</script>

<div
  class="rating"
  role="slider"
  tabindex="0"
  aria-valuemin="0"
  aria-valuemax={max}
  aria-valuenow={rating}
  onkeydown={handleKeydown}
  onmouseleave={() => { hovered = 0 }}
>
  {#each Array.from({ length: max }, (_, index) => index + 1) as stars}
    <button
      type="button"
      tabindex="-1"
      class="star"
      class:is-on={stars <= shown}
      class:is-preview={hovered > 0}
      aria-label={`${stars} star${stars === 1 ? "" : "s"}`}
      onmouseenter={() => { if (!peranti.readOnly) hovered = stars }}
      onclick={() => { pick(stars) }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
      </svg>
    </button>
  {/each}

  <span class="label">{rating ? `${rating} / ${max}` : "Not rated"}</span>
</div>

<style>
  .rating {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 12px;
    border-radius: var(--radius-md);
    outline: none;
  }

  .rating:focus-visible {
    box-shadow: 0 0 0 2px var(--focus-ring);
  }

  .star {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: none;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .star:hover {
    transform: scale(1.12);
  }

  .star svg {
    width: 22px;
    height: 22px;
    fill: transparent;
    stroke: var(--faint);
    stroke-width: 1.5;
    stroke-linejoin: round;
    transition: fill 0.1s ease, stroke 0.1s ease;
  }

  .star.is-on svg {
    fill: #f5b301;
    stroke: #f5b301;
  }

  .star.is-on.is-preview svg {
    fill: color-mix(in srgb, #f5b301 55%, transparent);
  }

  .label {
    margin-left: 10px;
    color: var(--muted);
    font-size: 12px;
  }
</style>
