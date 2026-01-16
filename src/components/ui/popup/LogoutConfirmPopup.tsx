type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function LogoutConfirmPopup({
  open,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm text-center space-y-4">
        <h2 className="text-lg font-semibold text-red-600">
          Logout?
        </h2>

        <p className="text-gray-600">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-orange-500 text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
