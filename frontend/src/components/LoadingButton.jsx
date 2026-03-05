export default function LoadingButton({
  text,
  loadingText = "Loading...",
  loading = false,
  onClick,
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? loadingText : text}
    </button>
  )
}