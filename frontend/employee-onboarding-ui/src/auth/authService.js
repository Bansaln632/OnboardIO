import api from "../api/axiosConfig";
import { API_ENDPOINTS } from "../constants";

export const login = async (data) => {
  const res = await api.post(API_ENDPOINTS.LOGIN, data);
  localStorage.setItem("token", res.data);
  return res.data;
};

export const signup = async (data) => {
  return api.post(API_ENDPOINTS.SIGNUP, data);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getRoleFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.sub,
      role: payload.role,
    };
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
