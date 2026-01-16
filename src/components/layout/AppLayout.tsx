import Header from "./Header"
import ScanButton from "../ui/home/ScanButton"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import LogoutConfirmPopup from "../ui/popup/LogoutConfirmPopup"
import { auth } from "../../auth/auth"

export default function AppLayout() {
   const location = useLocation()
   const navigate = useNavigate()
   const [showLogoutPopup, setShowLogoutPopup] = useState(false)

   const hideScanButton = location.pathname === "/scan"
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile frame */}
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-gray-100">

        {/* Header */}
        <Header onHomeBack={() => setShowLogoutPopup(true)} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-3 pt-4 pb-32 space-y-6">
          <Outlet />
        </main>

        {/* Fixed bottom scan button (width constrained) */}
         {!hideScanButton && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-gray-100 px-3 pb-4 pt-3">

          <ScanButton />
        </div>
          )}

        <LogoutConfirmPopup
          open={showLogoutPopup}
          onCancel={() => setShowLogoutPopup(false)}
          onConfirm={() => {
            auth.logout()
            navigate("/login", { replace: true })
          }}
        />
      </div>
    </div>
  )
}
