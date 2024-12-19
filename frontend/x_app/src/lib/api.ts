import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL
})

const getAuthToken = () => {
  return localStorage.getItem("token");
}

export const fetchCurrentUser = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return null;
    }

    console.log(token)

    const response = await api.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Failed to fetch current user: ", err);
    return undefined;
  }
}