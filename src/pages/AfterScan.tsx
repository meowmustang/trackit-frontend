import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import GreetingCard from "../components/ui/home/GreetingCard"
import RoomSummary from "../components/ui/scan/RoomSummary"
import CheckActionCard from "../components/ui/scan/CheckActionCard"
import LastScannedRoom from "../components/ui/scan/LastScannedRoom"
import Popup from "../components/ui/popup/commonpopup"
import type { WorkerProfile } from "../types/worker"
import GateConfirmModal from "../components/ui/scan/GateConfirmModal"
import RoomSwitchConfirmModal from "../components/ui/scan/RoomSwitchConfirmModal"
import { queueEvent } from "../services/offlineQueue"
import { useOnlineStatus } from "../services/useOnlineStatus"
import { API_BASE_URL } from "../config/api"

type ScanRoom = {
  type: "gate" | "room"
  room_id: string
  room_number: string
  floor: number
} 


export default function AfterScan() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const room = state as ScanRoom | null
  const isOnline = useOnlineStatus()

  const [confirmSwitch, setConfirmSwitch] = useState<{
    currentRoom: string
    nextRoom: string
  } | null>(null)



  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [popupMessage, setPopupMessage] = useState<string | null>(null)
  const [popupType, setPopupType] =
    useState<"success" | "error">("error")

  const [showGateModal, setShowGateModal] = useState(false)
  const [gateAction, setGateAction] =
    useState<"gate_in" | "gate_out">("gate_in")

  const [lastAction, setLastAction] =
    useState<{ check_in?: string; check_out?: string }>({})

  const isGate = room?.type === "gate"

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("trackit_token")
        if (!token) return

        const res = await fetch(`${API_BASE_URL}/api/labour/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error()
        setProfile(await res.json())
      } catch {
        setPopupMessage("Failed to load profile")
      }
    }

    fetchMe()
  }, [])

  const sendRoomEvent = async (
    action: "check_in" | "check_out",
    force = false
  ) => {
    if (confirmSwitch && !force) return

    if (!room) return

      const token = localStorage.getItem("trackit_token")
      if (!token) return

      const payload = {
        client_event_id: crypto.randomUUID(),
        room_id: room.room_id,
        room_no: room.room_number,
        floor_no: room.floor,
        action,
        event_time: new Date().toISOString(),
        ...(force ? { force: true } : {}),
      }
    
      if (!navigator.onLine) {
    await queueEvent(payload)

    setPopupType("success")
    setPopupMessage("Saved offline. Will sync automatically.")

    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

      setLastAction((prev) => ({
      ...prev,
      [action]: now,
    }))

    return
  }

  try {
      const res = await fetch(
  `${API_BASE_URL}/api/labour/events`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }
)

// ✅ read body ONCE
const data = await res.json()

// ---------- ROOM SWITCH ----------
if (!res.ok && data?.code === "CONFIRM_ROOM_SWITCH") {
  setPopupMessage(null)
  setPopupType("error")

  setConfirmSwitch({
    currentRoom: data.current_room,
    nextRoom: data.next_room,
  })
  return
}

// ---------- REAL ERROR ----------
if (!res.ok) {
  setPopupType("error")
  setPopupMessage(
    typeof data.message === "string"
      ? data.message
      : "Action failed"
  )
  return
}

// ---------- SUCCESS ----------
setPopupType("success")
setPopupMessage(
  action === "check_in"
    ? "Checked in successfully"
    : "Checked out successfully"
)

const now = new Date().toLocaleTimeString("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})

setLastAction((prev) => ({
  ...prev,
  [action]: now,
}))
  } catch (err: any) {
    await queueEvent(payload)

    setPopupType("success")
    setPopupMessage("Saved offline. Will sync automatically.")

    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })

    setLastAction((prev) => ({
      ...prev,
      [action]: now,
    }))
  }

   
  }

  const sendGateEvent = async () => {
    if (!room) return

    try {
      const token = localStorage.getItem("trackit_token")
      if (!token) return

      const payload = {
        client_event_id: crypto.randomUUID(),
        room_id: room.room_id,
        room_no: room.room_number,
        floor_no: room.floor,
        action: gateAction,
        event_time: new Date().toISOString(),
      }

      const res = await fetch(
        `${API_BASE_URL}/api/labour/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message)
      }

      setShowGateModal(false)
      setTimeout(() => navigate("/home"), 1200)
    } catch (err: any) {
      setPopupMessage(err.message)
    }
  }

  if (!room) return <div className="p-4">Invalid scan</div>

  return (
    <>
     {confirmSwitch && (
  <RoomSwitchConfirmModal
    currentRoom={confirmSwitch.currentRoom}
    nextRoom={confirmSwitch.nextRoom}
    onConfirm={() => {
      setConfirmSwitch(null)
      sendRoomEvent("check_in", true)
    }}
    onCancel={() => {
      setConfirmSwitch(null)
    }}
  />
)}

      {showGateModal && (
        <GateConfirmModal
          mode={gateAction === "gate_in" ? "in" : "out"}
          onConfirm={sendGateEvent}
          onCancel={() => setShowGateModal(false)}
        />
      )}

      <div className="flex flex-col h-full space-y-4 p-4">
        {profile && <GreetingCard profile={profile} />}

        <RoomSummary
          roomNumber={room.room_number}
          floor={room.floor}
        />

        <CheckActionCard
            roomNumber={room.room_number}
            onCheckIn={() => {
              if (isGate) {
                setGateAction("gate_in")
                setShowGateModal(true)
              } else {
                sendRoomEvent("check_in")
              }
            }}
            onCheckOut={() => {
              if (isGate) {
                setGateAction("gate_out")
                setShowGateModal(true)
              } else {
                sendRoomEvent("check_out")
              }
            }}
            checkInLabel={isGate ? "Gate In" : "Check-in"}
            checkOutLabel={isGate ? "Gate Out" : "Check-out"}
          />


        <LastScannedRoom
          roomNumber={room.room_number}
          floor={room.floor}
          checkIn={lastAction.check_in}
          checkOut={lastAction.check_out}
        />

        {!confirmSwitch && popupMessage && (
            <Popup
              open={true}
              message={popupMessage}
              type={popupType}
              onClose={() => setPopupMessage(null)}
            />
          )}
          {!isOnline && (
            <div className="bg-yellow-100 text-yellow-800 text-sm p-2 text-center">
              Offline mode — actions will sync automatically
            </div>
          )}
      </div>
    </>
  )
}
