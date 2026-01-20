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


  useEffect(() => {
    const loadState = async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/worker/current-state`,{cache: 'no-store'})
       if (!res.ok) throw new Error("Failed to fetch worker state")
        const data = await res.json()
        setInsideBuilding(data.inside_building)
      } catch (err) {
        console.error("Failed to load worker state", err)
      }
    }
    
    loadState()
  }, [])

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

     {insideBuilding !== null && (
      <div
        className={`text-sm px-3 py-1 rounded-full ${
          insideBuilding
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {insideBuilding ? "🟢 Inside Building" : "🔴 Outside Building"}
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
