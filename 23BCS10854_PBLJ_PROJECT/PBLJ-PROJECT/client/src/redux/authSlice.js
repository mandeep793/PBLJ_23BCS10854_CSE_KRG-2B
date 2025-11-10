import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: token || null,
    user: user || null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
