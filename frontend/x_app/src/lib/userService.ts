import { api } from "@/lib/api";

/**
 * Kullanıcıların listesini alır.
 * 
 * Bu fonksiyon, backend API'den kullanıcıların listesini çeker.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @returns {Promise<any>} API'den dönen kullanıcılar verisi.
 * @throws {Error} Eğer API'den veri çekme sırasında bir hata oluşursa, hata fırlatılır.
 */
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

/**
 * Belirli bir kullanıcıyı ID'sine göre alır.
 * 
 * Bu fonksiyon, verilen kullanıcı ID'sine göre o kullanıcıyı API'den çeker.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @param {string} userId - Kullanıcının benzersiz ID'si.
 * @returns {Promise<any>} API'den dönen kullanıcı verisi.
 * @throws {Error} Eğer kullanıcı verisi çekilirken bir hata oluşursa, hata fırlatılır.
 */
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

/**
 * Kullanıcıyı takip eder.
 * 
 * Bu fonksiyon, verilen kullanıcıyı takip etme isteği gönderir. 
 * `currentUserId` ve `user_id` bilgileri gönderilir ve API'den bir takip durumu döner.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @param {number} user_id - Takip edilecek kullanıcının ID'si.
 * @param {number} currentUserId - Takip eden kullanıcının ID'si.
 * @returns {Promise<string>} API'den dönen mesaj.
 * @throws {Error} Eğer takip etme işlemi sırasında bir hata oluşursa, hata mesajı döndürülür.
 */
export async function followUser(user_id: number, currentUserId: number) {
  try {
    const response = await api.post<FollowResponse>(`/users/${user_id}/follow`, {
      current_user_id: currentUserId,
      user_id: user_id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
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

export const unfollowUser = async (userId: number, currentUserId: number) => {
  try {
    const response = await api.delete(`/users/${userId}/unfollow`, {
      params: {
        user_id: userId,
        current_user_id: currentUserId,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      }
    });
    return response.data.message;
  } catch (error: any) {
    console.error("Error unfollowing user:", error);
    if (error.response) {
      return error.response.detail;
    } else {
      return `Error: ${error.message}`;
    }
  }
}

/**
 * Bir kullanıcının takipçilerini getirir.
 * 
 * Bu fonksiyon, belirtilen kullanıcı ID'sine göre takipçilerini API'den çeker.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @param {number} userId - Takipçileri çekilecek kullanıcının ID'si.
 * @returns {Promise<any>} API'den dönen takipçi verisi.
 * @throws {Error} Eğer takipçiler çekilirken bir hata oluşursa, hata fırlatılır.
 */
export async function getFollowers(userId: number) {
  try {
    const response = await api.get(`/users/${userId}/followers`, {
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

/**
 * Bir kullanıcının takip ettiklerini getirir.
 * 
 * Bu fonksiyon, belirtilen kullanıcı ID'sine göre takip ettikleri kişileri API'den çeker.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @param {number} user_id - Takip ettikleri kişileri çekilecek kullanıcının ID'si.
 * @returns {Promise<any>} API'den dönen takip ettikler verisi.
 * @throws {Error} Eğer takip edilen kullanıcılar çekilirken bir hata oluşursa, hata fırlatılır.
 */
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

/**
 * Kullanıcının başka bir kullanıcıyı takip edip etmediğini kontrol eder.
 * 
 * Bu fonksiyon, belirtilen kullanıcı ID'si ve currentUserId'yi kullanarak
 * takip durumu bilgisini API'den kontrol eder.
 * Authorization başlığı ile token'ı kullanarak doğrulama yapılır.
 * 
 * @param {number} userId - Takip durumu kontrol edilecek kullanıcının ID'si.
 * @param {number} currentUserId - Takip durumunu kontrol eden kullanıcının ID'si.
 * @returns {Promise<boolean>} Takip durumu (true veya false).
 * @throws {boolean} Eğer hata oluşursa, `false` döndürülür.
 */
export const checkIfUserIsFollowing = async (userId: number, currentUserId: number) => {
  try {
    const response = await api.get(`/users/${userId}/is-following`, {
      params: {
        current_user_id: currentUserId
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
    return response.data.is_following;
  } catch(error) {
    console.error("Error checking if user is following: ", error)
    throw false;
  }
}
