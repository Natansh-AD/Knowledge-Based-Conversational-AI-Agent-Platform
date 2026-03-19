import { useEffect, useState } from "react";
import { useAuth } from "../services/auth/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import "../styles/ChatPage.css";
import { useRef } from "react";

export default function ChatPage() {
  const { getMessages, sendMessage, createChat } = useAuth();
  const { org, agentId, chatId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("")
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Load messages ONLY if chat exists
  useEffect(() => {
    if (!chatId) return;

    async function loadMessages() {
      try {
        const data = await getMessages(chatId);
        setMessages(data.messages);
        setTitle(data.chat_title)
      } catch (err) {
        console.error(err);
      }
    }

    loadMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message (create chat IF needed)
  const handleSend = async () => {
    if (!input.trim() || !agentId || loading) return;

    let activeChatId = chatId;

    // If no chat exists → create one FIRST
    if (!activeChatId) {
      try {
        const chat = await createChat(agentId);
        activeChatId = chat.id;

        // redirect to new chat URL
        navigate(`/${org}/agents/${agentId}/${activeChatId}`);
      } catch (err) {
        console.error(err);
        return;
      }
    }

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(activeChatId, input);

      const botMessage = {
        role: "assistant",
        content: res.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <ChatSidebar agentId={agentId} />

      <div className="chat-main">
        <div className="chat-header">
          Agent {agentId}
          {title ? ` | ${title}` : " | New Chat"}
          {/* {chatId ? ` | Chat ${chatId}` : ""} */}
        </div>

        {/* EMPTY STATE */}
        {!chatId ? (
          <div className="empty-state">
            <p>Start a new conversation</p>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble ${
                  msg.role === "user" ? "user" : "bot"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && <div className="chat-bubble bot">Typing...</div>}
            {/* <div ref={bottomRef}></div> */}
          </div>
        )}

        {/* ✅ Input ALWAYS visible */}
        <div className="chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // prevent default enter behavior
                handleSend();
              }
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSend} disabled={!input.trim()}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 