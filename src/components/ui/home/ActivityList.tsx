import type { TodayActivity } from "../../../types/activity"

type Props = {
  activities: TodayActivity[]
}

const formatTime = (iso?: string | null) => {
  if (!iso) return "--"
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  })
}

export default function ActivityList({ activities = [] }: Props) {
  if (!activities.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 text-sm text-gray-500">
        No activity today
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex justify-between items-center px-5 py-4 border-b">
        <span className="font-medium text-gray-700">My activity</span>
        <span className="text-sm text-gray-500">Today</span>
      </div>

      <div className="divide-y">
        {activities.map((item) => (
          <div
            key={`${item.room_number}-${item.check_in_time}`}
            className="px-5 py-4 flex justify-between"
          >
            <div>
              <p className="font-medium">{item.room_number}</p>
              <p className="text-sm text-gray-500">Floor {item.floor}</p>
            </div>

            <div className="text-right text-sm">
              <p>
                Check-in{" "}
                <span className="text-green-600">
                  {formatTime(item.check_in_time)}
                </span>
              </p>
              <p>
                Check-out{" "}
                <span className="text-green-600">
                  {formatTime(item.check_out_time)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
