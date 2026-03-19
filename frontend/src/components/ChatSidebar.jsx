import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/ChatSidebar.css";

export default function ChatSidebar({ agentId }) {
  const { getChats, createChat } = useAuth();
  const navigate = useNavigate();
  const { org,chatId } = useParams();

  const [chats, setChats] = useState([]);

  useEffect(() => {
    console.log(agentId)
    if (!agentId) return;

    async function fetchChats() {
      try {
        const data = await getChats(agentId);
        console.log(data)
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
            const chat = await createChat(agentId);

            setChats((prev) => [chat, ...prev]); // add here

            navigate(`/${org}/agents/${agentId}/${chat.id}`);
        } catch (err) {
            console.error(err);
        }
    };

  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={handleNewChat}>
        + New Chat
      </button>

      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${chatId == chat.id ? "active" : ""}`}
            onClick={() => navigate(`/${org}/agents/${agentId}/${chat.id}`)}
          >
            {chat.title || `Chat #${chat.id}`}
          </div>
        ))}
      </div>
    </div>
  );
}