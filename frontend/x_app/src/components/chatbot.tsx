import { useState, useEffect, useContext } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { getChatMessages, sendChatMessage } from "@/lib/chatMessageService";
import Image from "next/image";
import { AuthContext } from "@/app/utils/AuthContext";
import { formatTime } from "@/lib/utils";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const { user: currentUser } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChatMessages();
        setMessages(chatMessages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const botResponse = await sendChatMessage(input);
      const botMessage: Message = { sender: "bot", text: botResponse.text };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: "bot",
        text: "Bot yanıtı alınamadı.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white py-4 px-6 text-lg font-semibold flex items-center rounded-t-lg">
          hsGPT
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } items-center`}
            >
              {message.sender === "bot" && (
                <Image
                  src="/bot-avatar.jpg"
                  alt="Bot Avatar"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              )}
              <div
                className={`max-w-sm px-4 py-2 rounded-2xl text-sm shadow-md ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
                <div className="bottom-1 right-2 text-xs text-gray-400">
                  {formatTime(message.created_at)}
                </div>
              </div>
              {message.sender === "user" && currentUser && (
                <Image
                  src={currentUser.profile_picture || "/avatar-placeholder.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full ml-3"
                />
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t bg-gray-50 px-4 py-3 flex items-center gap-3 rounded-b-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 flex items-center justify-center"
          >
            <AiOutlineSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
