import { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Simulate bot response
    const botMessage: Message = {
      sender: "bot",
      text: "Bu bir bot mesajı! ChatGPT'ye hoş geldiniz.",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);

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
              }`}
            >
              <div
                className={`max-w-sm px-4 py-2 rounded-2xl text-sm shadow-md ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {message.text}
              </div>
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
