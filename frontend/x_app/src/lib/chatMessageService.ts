import { api } from "./api";

export const getChatMessages = async () => {
    try {
        const response = await api.get("/chat_messages", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        return response.data;
    } catch (err) {
        console.error("Mesajı alırken hata oluştu:", err)
        throw err;
    }
}
