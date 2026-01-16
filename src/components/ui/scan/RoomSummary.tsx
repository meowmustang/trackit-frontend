type Props = {
  roomNumber: string
  floor: number
}

export default function RoomSummary({ roomNumber, floor }: Props) {
  return (
    <div className="flex justify-between px-2 text-sm text-gray-600">
      <span>Floor {floor}</span>
      <span>{roomNumber}</span>
    </div>
  )
}
