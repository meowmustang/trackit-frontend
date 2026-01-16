import axios from "axios"

const api = axios.create({
  baseURL: "${import.meta.env.VITE_API_BASE_URL}api",
  withCredentials: true, // IMPORTANT for refresh cookie
})

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        // Call refresh endpoint
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = res.data.accessToken

        // Save new token
        localStorage.setItem("trackit_token", newAccessToken)

        // Retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch {
        // Refresh failed → force logout
        localStorage.clear()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
