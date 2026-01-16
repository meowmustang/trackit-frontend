export function logout() {
  localStorage.removeItem("trackit_token")
  localStorage.removeItem("trackit_name")

  window.location.href = "/login"
}
