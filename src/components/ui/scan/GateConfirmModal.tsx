type Props = {
  mode: "in" | "out"
  onConfirm: () => void
  onCancel: () => void
}

export default function GateConfirmModal({ mode, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center space-y-4">
        {mode === "in" ? (
          <>
            <h2 className="text-lg font-semibold">QR scanned successfully</h2>
            <p className="text-gray-600">
              You are now inside the building
            </p>
            <button
              onClick={onConfirm}
              className="w-full py-3 bg-orange-500 text-white rounded-xl"
            >
              OK
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-red-600">
              Exit Building?
            </h2>
            <p className="text-gray-600">
              All active room check-ins will be automatically checked out.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl"
              >
                Yes
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
