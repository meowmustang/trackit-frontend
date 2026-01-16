type Props = {
  open: boolean
  message: string
  onClose: () => void
  type?: "success" | "error"
}

export default function Popup({
  open,
  message,
  onClose,
  type = "error",
}: Props) {
  if (!open) return null

  const isSuccess = type === "success"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center space-y-4">
        <h2
          className={`text-lg font-semibold ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Success" : "Action not allowed"}
        </h2>

        <p className="text-gray-600">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-orange-500 text-white rounded-xl"
        >
          OK
        </button>
      </div>
    </div>
  )
}
