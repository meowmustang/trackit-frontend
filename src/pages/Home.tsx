import { useEffect, useState } from "react"
import GreetingCard from "../components/ui/home/GreetingCard"
import ActivityList from "../components/ui/home/ActivityList"
import type { WorkerProfile } from "../types/worker"
import type { TodayActivity } from "../types/activity"
import { authFetch } from "../auth/authFetch"
import { syncOfflineEvents } from "../services/syncOfflineEvents"
import { useOnlineStatus } from "../services/useOnlineStatus"

export default function Home() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<TodayActivity[]>([])
  const isOnline = useOnlineStatus()

  useEffect(() => {
    
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("trackit_token")
        if (!token) throw new Error("No token found")


        const res = await authFetch('${API_BASE_URL}/api/labour/me')

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

      const res = await authFetch('${API_BASE_URL}/api/labour/activity/today')

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
