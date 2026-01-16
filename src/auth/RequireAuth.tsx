import { Navigate } from "react-router-dom"
import { auth } from "./auth"
import type { ReactNode } from "react"

export default function RequireAuth({
  children,
}: {
  children: ReactNode
}) {
  if (!auth.isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
