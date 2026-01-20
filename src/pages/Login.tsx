import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/auth";
import { API_BASE_URL } from "../config/api";

import NotchedInput from "../components/ui/auth/NotchedInput";
import PrimaryButton from "../components/ui/auth/PrimaryButton";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/labour/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone_number: phone,
        }),
      });

      if (res.status === 201) {
        const data = await res.json();

        // ✅ store ONLY the JWT
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("refresh_token", data.refresh_token)

        navigate("/home", { replace: true });
        return;
      }

      if (res.status === 401 || res.status === 404) {
        navigate("/signup");
        return;
      }


      setError("Login failed. Please try again.");
    } catch (err) {
      setError("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      
      {/* Content container */}
      <div className="w-full max-w-sm flex flex-col">
        
        <div className="flex flex-col">
          <img
            src="/logos/trackit.svg"
            alt="TrackIt"
            className="h-20 mx-auto mb-14"
          />

          <h1 className="text-orange-500 text-3xl font-bold mb-8">
            Login
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-7">
          <NotchedInput
            label="Name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <NotchedInput
            label="Phone"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <PrimaryButton onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </PrimaryButton>

          <p className="text-center text-sm text-gray-600">
            Not have account?{" "}
            <Link to="/signup" className="text-orange-500 font-medium">
              Signup here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
