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

export const sendChatMessage = async (message: string) => {
    try {
        const response = await api.post("chat_messages", { text: message, sender: "user"}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Mesaj gönderirken hata oluştu:", error);
        throw error;
    }
}