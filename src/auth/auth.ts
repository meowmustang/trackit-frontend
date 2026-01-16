export const auth = {
  setToken(token: string) {
    localStorage.setItem("trackit_token", token);
  },

  getToken() {
    return localStorage.getItem("trackit_token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("trackit_token");
  },

  logout() {
    localStorage.removeItem("trackit_token");
    localStorage.removeItem("trackit_name");
  },
};
