// `rating` is the number the star rating sets, 0 when cleared
const labels = ["Not rated", "Poor", "Fair", "Good", "Great", "Excellent"]

export default function reviewCard({ rating, comment }) {
  const stars = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)))
  const line = `${"★".repeat(stars)}${"☆".repeat(5 - stars)}  ${labels[stars]} (${stars}/5)`

  return { review: comment?.trim() ? `${line}\n\n${comment.trim()}` : line }
}
