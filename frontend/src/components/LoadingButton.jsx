export default function LoadingButton({
  text,
  loadingText = "Loading...",
  loading = false,
  onClick,
  type = "button",
  disabled = false,
  className = ""
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        px-6 py-2 rounded-lg font-medium transition
        border border-gray-300
        ${loading || disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-800 hover:bg-gray-50 hover:shadow-sm focus:ring-2 focus:ring-gray-300"}
        ${className}
      `}
    >
      {loading ? loadingText : text}
    </button>
  )
}