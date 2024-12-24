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

interface FollowResponse {
  message: string;
}

export async function followUser(user_id: number, current_user_id: number) {
  try {
    const response = await api.post<FollowResponse>(`/users/${user_id}/follow`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        user_id: user_id,
        current_user_id: current_user_id,
      }
    });

    return response.data.message;
  } catch (error: any) {
    if (error.response) {
      // API'den dönen hata yanıtı
      return `Error: ${error.response.data.detail || error.response.data.message}`;
    } else {
      // Diğer hata durumları
      return `Error: ${error.message}`;
    }
  }
}

export async function getFollowers(user_id: number) {
  try {
    const response = await api.get(`/users/${user_id}/followers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
    return response.data;
  } catch (error: any) {
    console.error("Error fetching followers: ", error)
    throw error;
  }
}

export async function getFollowings(user_id: number) {
  try {
    const response = await api.get(`/users/${user_id}/following`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
    return response.data;
  } catch (error: any) {
    console.error("Error fetching followings: ", error)
    throw error;
  }
}