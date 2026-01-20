export const auth = {
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  },

  getAccessToken() {
    return localStorage.getItem("access_token");
  },

  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("access_token");
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("trackit_name");
    window.location.href = "/login";
  },
};
