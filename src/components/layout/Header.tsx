import { useNavigate, useLocation } from "react-router-dom"



type HeaderProps = {
  onHomeBack?: () => void
}

export default function Header({ onHomeBack }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    const path = location.pathname

    if (path.startsWith("/scan") || path.startsWith("/after-scan")) {
      navigate ("/home", { replace: true })
      return
    }
    if (path === "/home") {
      onHomeBack?.()
      return
    }
    navigate(-1)
  }
  return (
    <header className="bg-white shadow-sm relative">
      <div className="mx-auto max-w-md px-4 h-20 flex items-center justify-between">

        {/* Left: Back button */}
        <button
  onClick={handleBack}
  className="
    ml-3
    w-11 h-11
    flex items-center justify-center
    rounded-full
    bg-white
    border border-gray-200
    shadow
    active:scale-95
    transition
  "
  aria-label="Go back"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-gray-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
</button>


        {/* Right: Client logo */}
        <img
          src="/logos/oberoi.svg"
          alt="Client"
          className="h-7 object-contain"
        />
      </div>

      {/* Center: TrackIt logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/logos/trackit.svg"
          alt="TrackIt"
          className="h-10 sm:h-12 object-contain"
        />
      </div>
    </header>
  )
}
