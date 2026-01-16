type Props = {
  status: "success" | "error"
  message: string
  onClose: () => void
}

export default function AuthResultModal({ status, message, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[280px] p-6 relative text-center">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 text-lg"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="text-green-500 text-4xl mb-4">✔</div>
        ) : (
          <div className="text-red-500 text-4xl mb-4">✖</div>
        )}

        <h3 className="font-semibold text-lg mb-2">
          {status === "success" ? "Woohoo!" : "Oops!"}
        </h3>

        <p className="text-sm text-gray-600">
          {message}
        </p>
      </div>
    </div>
  )
}
