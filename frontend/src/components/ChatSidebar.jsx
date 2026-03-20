import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";

export default function ChatSidebar({ agentId }) {
  const { getChats, createChat } = useAuth();
  const navigate = useNavigate();
  const { org, chatId } = useParams();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!agentId) return;

    async function fetchChats() {
      try {
        const data = await getChats(agentId);
        setChats(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchChats();
  }, [agentId]);

  const handleNewChat = async () => {
    if (!agentId || !org) return;

    try {
      // const chat = await createChat(agentId);
      // setChats((prev) => [chat, ...prev]);
      navigate(`/${org}/agents/${agentId}/`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-gray-900 text-white p-5 shadow-md">
      <button
        className="mb-4 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-md font-semibold transition-colors duration-200"
        onClick={handleNewChat}
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`px-3 py-2 rounded-md cursor-pointer text-sm transition-colors duration-200 ${
              chatId == chat.id
                ? "bg-gray-600 text-white font-semibold"
                : "bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={() => navigate(`/${org}/agents/${agentId}/${chat.id}`)}
          >
            {chat.title || `Chat #${chat.id}`}
          </div>
        ))}
      </div>
    </div>
  );
}