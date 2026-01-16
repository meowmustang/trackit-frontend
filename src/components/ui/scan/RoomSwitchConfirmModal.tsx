type Props = {
  currentRoom: string
  nextRoom: string
  onConfirm: () => void
  onCancel: () => void
}

export default function RoomSwitchConfirmModal({
  currentRoom,
  nextRoom,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm space-y-4 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          Switch Room?
        </h2>

        <p className="text-gray-700 text-sm">
          You are already checked into
          <br />
          <b>{currentRoom}</b>
        </p>

        <p className="text-gray-700 text-sm">
          If you continue, you will be checked out from
          <br />
          <b>{currentRoom}</b>
          <br />
          and checked into
          <br />
          <b>{nextRoom}</b>
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
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
