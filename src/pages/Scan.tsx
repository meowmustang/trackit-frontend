import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/browser"
import type { IScannerControls } from "@zxing/browser"
import { useNavigate } from "react-router-dom"

import GreetingCard from "../components/ui/home/GreetingCard"
import type { WorkerProfile } from "../types/worker"

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const scanningRef = useRef(false)

  const [profile, setProfile] = useState<WorkerProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  /* =========================
     Fetch worker profile
     ========================= */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem("trackit_token")
        if (!token) throw new Error()

        const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/labour/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error()
        setProfile(await res.json())
      } catch {
        setError("Failed to load profile")
      }
    }

    fetchMe()
  }, [])

  /* =========================
     Start QR scanner
     ========================= */


  const startScanner = async () => {
  if (!videoRef.current) return

  const reader = new BrowserMultiFormatReader()

  try {
    const controls = await reader.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      async (result) => {
        if (!result || scanningRef.current) return

        scanningRef.current = true
        controls.stop()

        await handleScan(result.getText())
      }
    )

    controlsRef.current = controls
  } catch {
    setError("Camera access denied")
  }
}

useEffect(() => {
  startScanner()

  return () => {
    controlsRef.current?.stop()
  }
}, [])

  useEffect(() => {
    if (!videoRef.current) return

    const reader = new BrowserMultiFormatReader()

    reader
      .decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result) => {
          if (!result) return
          if (scanningRef.current) return

          scanningRef.current = true
          controlsRef.current?.stop()

          await handleScan(result.getText())
        }
      )
      .then((controls) => {
        controlsRef.current = controls
      })
      .catch(() => {
        setError("Camera access denied")
      })

    return () => {
      controlsRef.current?.stop()
    }
  }, [])

  /* =========================
     Handle scan result
     ========================= */
  const handleScan = async (qrText: string) => {
    try {
      const token = localStorage.getItem("trackit_token")
      if (!token) throw new Error()

      const res = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/labour/scan', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ qr: qrText }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()

      // ✅ Navigate with room data
      navigate("/after-scan", { state: data })
    } catch {
      scanningRef.current = false
      setError("Invalid QR or server error")

      // 🔁 Restart camera after failure
      scanningRef.current = false
        startScanner()
    }
  }

  /* =========================
     UI
     ========================= */
  return (
    <div className="flex flex-col h-full space-y-4 p-4">
      {profile && <GreetingCard profile={profile} />}

      <h2 className="text-lg font-semibold">QR Scanning</h2>

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  )
}
