import { api } from "@/lib/api";

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

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Kullanıcıları alırken hata oluştu.", error)
    throw error;
  }
}