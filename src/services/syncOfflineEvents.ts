import { getQueuedEvents, removeEvent, markEventFailed } from "./offlineQueue"
import { authFetch } from "../auth/authFetch"
import { API_BASE_URL } from "../config/api"

export async function syncOfflineEvents() {
  const events = await getQueuedEvents()
  if (!events.length) return

  for (const e of events) {
    try {
      const res = await authFetch(
        `${API_BASE_URL}/api/labour/events`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(e),
        }
      )

      const data = await res.json()

      // ✅ ACCEPTED
      if (res.ok) {
        await removeEvent(e.client_event_id)
        continue
      }

      // 🔁 RULE CONFLICT → STOP SYNC
      if (data?.code === "CONFIRM_ROOM_SWITCH") {
        await markEventFailed(e.client_event_id, {
          type: "ROOM_SWITCH_CONFLICT",
          details: data,
        })
        break
      }

      // ❌ HARD FAILURE → STOP
      await markEventFailed(e.client_event_id, data)
      break

    } catch (err) {
      // 🌐 Network unstable → stop safely
      return
    }
  }
}
