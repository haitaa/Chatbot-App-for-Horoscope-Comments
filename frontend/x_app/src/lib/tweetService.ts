import { api } from "./api";

/**
 * Tweet'leri almak için kullanılan fonksiyon.
 * Bu fonksiyon, API'ye GET isteği göndererek tüm tweet'leri alır.
 * Authorization başlığında kullanıcı token'ı kullanılır.
 * 
 * @returns {Promise<Array>} Tweet'lerin listesi
 * @throws {Error} API isteği sırasında oluşabilecek hatalar
 */
export const fetchTweets = async () => {
    try {
        const response = await api.get("/tweets", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,  // Token başlıkta eklenir
                "Content-Type": "application/json"
            }
        })
        return response.data;
    } catch (err) {
        console.error("Tweets alınırken hata oluştu", err)
        throw err;
    }
}

/**
 * Kullanıcının tweet'lerini almak için kullanılan fonksiyon.
 * Bu fonksiyon, API'ye GET isteği göndererek belirli bir kullanıcının tweet'lerini alır.
 * Kullanıcı ID'si URL parametresi olarak gönderilir ve Authorization başlığında kullanıcı token'ı kullanılır.
 * 
 * @param {Number} userId - Kullanıcının ID'si
 * @returns {Promise<Array>} Kullanıcının tweet'lerinin listesi
 * @throws {Error} API isteği sırasında oluşabilecek hatalar
 */
export const getUserTweets = async (userId: Number) => {
    try {
        const response = await api.get("/tweets/my_tweets", {
            params: {
                current_user_id: userId,  // Kullanıcı ID'si URL parametresi olarak gönderilir
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,  // Token başlıkta eklenir
                "Content-Type": "application/json"
            }
        })
        return response.data;
    } catch (err) {
        console.error("Kullanıcı tweetlerini alınırken hata oluştu", err)
        throw err;
    }
}
