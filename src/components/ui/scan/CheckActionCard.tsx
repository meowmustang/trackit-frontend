type Props = {
  onCheckIn: () => void
  onCheckOut: () => void
  roomNumber: string
  checkInLabel?: string
  checkOutLabel?: string
}

export default function CheckActionCard({
  onCheckIn,
  onCheckOut,
  roomNumber,
  checkInLabel = "Check-in",
  checkOutLabel = "Check-out",
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Welcome to {roomNumber}
      </h2>

      <button
        onClick={onCheckIn}
        className="w-full py-3 rounded-xl bg-orange-400 text-white text-lg font-medium"
      >
        {checkInLabel}
      </button>

      <button
        onClick={onCheckOut}
        className="w-full py-3 rounded-xl bg-orange-400 text-white text-lg font-medium"
      >
        {checkOutLabel}
      </button>
    </div>
  )
}
