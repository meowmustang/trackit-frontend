type Props = {
  roomNumber: string
  floor: number
  checkIn?: string
  checkOut?: string
}

export default function LastScannedRoom(  { roomNumber, floor, checkIn, checkOut }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 px-1">
        Last scanned room
      </p>

      <div className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-900">{roomNumber}</p>
          <p className="text-sm text-gray-500"> {floor}</p>
        </div>

        <div className="text-right text-sm">
          <p>
            Check-in <span className="text-green-600 ml-2">{checkIn || "00:00"}</span>
          </p>
          <p>
            Check-out <span className="text-green-600 ml-2">{checkOut || "00:00"}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
