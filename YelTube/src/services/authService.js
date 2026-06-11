import API from "./api";

const authService = {
  login: async (email, password) => {
    const response = await API.post("users/login/", { username: email, password });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("isLoggedIn", "true");
      // Get profile details
      const profileRes = await API.get("users/profile/");
      localStorage.setItem("currentUser", JSON.stringify(profileRes.data));
    }
    return response.data;
  },
  register: async (username, email, password, dateOfBirth) => {
    const response = await API.post("users/register/", {
      username,
      email,
      password,
      date_of_birth: dateOfBirth
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.setItem("isLoggedIn", "false");
  },
  getCurrentUser: async () => {
    const response = await API.get("users/profile/");
    localStorage.setItem("currentUser", JSON.stringify(response.data));
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await API.post("users/forgot-password/", { email });
    return response.data;
  },
  resetPassword: async (token, newPassword) => {
    const response = await API.post("users/reset-password/", { token, new_password: newPassword });
    return response.data;
  },
  googleLogin: async (token) => {
    const response = await API.post("users/google-login/", { token });
    if (response.data.tokens) {
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      localStorage.setItem("isLoggedIn", "true");
      const profileRes = await API.get("users/profile/");
      localStorage.setItem("currentUser", JSON.stringify(profileRes.data));
    }
    return response.data;
  },
  facebookLogin: async (token) => {
    const response = await API.post("users/facebook-login/", { token });
    if (response.data.tokens) {
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
      localStorage.setItem("isLoggedIn", "true");
      const profileRes = await API.get("users/profile/");
      localStorage.setItem("currentUser", JSON.stringify(profileRes.data));
    }
    return response.data;
  },
  getChannelProfile: async (username) => {
    const response = await API.get(`users/channel/${encodeURIComponent(username)}/`);
    return response.data;
  },
};

export default authService;
