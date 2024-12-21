import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL
})


export const fetchUsers = async () => {
  try {
    const response = await api.get("/users/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Kullanıcıları alırken hata oluştu.", error)
    throw error;
  }
}