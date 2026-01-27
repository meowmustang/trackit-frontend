import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { refreshToken } from "../services/refreshToken";
import type { ReactNode } from "react"

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const token = localStorage.getItem("trackit_token");

  useEffect(() => {
    if (!token) {
      refreshToken()
        .then(newToken => {
          localStorage.setItem("trackit_token", newToken);
        })
        .finally(() => setChecked(true));
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) return null;
  if (!localStorage.getItem("trackit_token"))
    return <Navigate to="/login" replace />;

  return <>{children}</>;
}
