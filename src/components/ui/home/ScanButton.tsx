import { useNavigate } from "react-router-dom"

export default function ScanButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/scan")}
      className="w-full rounded-xl border-2 border-black py-4 text-lg font-semibold bg-white"
    >
      Scan QR Code button
    </button>
  )
}
