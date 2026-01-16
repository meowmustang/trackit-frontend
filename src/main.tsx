import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { auth } from "./auth/auth";
import RequireAuth from "./auth/RequireAuth"
import Scan from "./pages/Scan";
import AfterScan from "./pages/AfterScan";


const router = createBrowserRouter([
  {
    path: "/",
    element: auth.isLoggedIn()
      ? <Navigate to="/home" />
      : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: (
     <RequireAuth>
      <AppLayout />,
      </RequireAuth>
  ),
    children: [
      { path: "/home", element: <Home /> },
      { path: "/scan", element: <Scan /> },
      { path: "/after-scan", element: <AfterScan /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);