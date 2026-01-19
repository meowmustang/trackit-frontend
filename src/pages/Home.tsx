import { useEffect, useState } from "react"
import GreetingCard from "../components/ui/home/GreetingCard"
import ActivityList from "../components/ui/home/ActivityList"
import type { WorkerProfile } from "../types/worker"
import type { TodayActivity } from "../types/activity"
import { authFetch } from "../auth/authFetch"
import { syncOfflineEvents } from "../services/syncOfflineEvents"
import { useOnlineStatus } from "../services/useOnlineStatus"
import { API_BASE_URL } from "../config/api"

export default function Home() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<TodayActivity[]>([])
  const isOnline = useOnlineStatus()
  const [insideBuilding, setInsideBuilding] = useState<boolean>(false)
  const [activeRoom, setActiveRoom] = useState<string | null>(null)


  const fetchWorkerState = async () => {
  const res = await authFetch("/api/worker/current-state")
  const data = await res.json()

  setInsideBuilding(data.inside_building)
  setActiveRoom(data.active_room_id)
}

useEffect(() => {
  fetchWorkerState()
}, [])



  const InsideBuildingBadge = ({ inside }: { inside: boolean }) => {
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        inside
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {inside ? "🟢 Inside Building" : "🔴 Outside Building"}
    </div>
  )
}



  useEffect(() => {
    
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("trackit_token")
        if (!token) throw new Error("No token found")


        const res = await authFetch(`${API_BASE_URL}/api/labour/me`)

        if (!res.ok) throw new Error("Unauthorized")

        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error("Failed to load profile", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
    window.addEventListener("online", syncOfflineEvents)
  syncOfflineEvents()

  return () => {
    window.removeEventListener("online", syncOfflineEvents)
  }

  }, [])

  useEffect(() => {
  const fetchTodayActivity = async () => {
    try {
      const token = localStorage.getItem("trackit_token")
      if (!token) return

      const res = await authFetch(`${API_BASE_URL}/api/labour/activity/today`)

      if (!res.ok) throw new Error("Failed to load activity")

      const data = await res.json()
      setActivities(data.activities)
    } catch (err) {
      console.error(err)
    }
  }

  fetchTodayActivity()
}, [])


  if (loading) return <div>Loading...</div>
  if (!profile) return <div>Failed to load profile</div>

  return (  
    <>

      <InsideBuildingBadge inside={insideBuilding} />
  
        {insideBuilding && activeRoom && (
      <div className="text-xs text-gray-500 mt-1">
        Current area: {activeRoom}
      </div>
    )}

      <GreetingCard profile={profile} />
      <ActivityList activities={activities} />
      {!isOnline && (
        <div className="bg-yellow-100 text-yellow-800 text-sm p-2 text-center">
          Offline mode — actions will sync automatically
        </div>
      )}
    </>
  )
}
