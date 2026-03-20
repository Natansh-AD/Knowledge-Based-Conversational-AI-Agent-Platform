import { useEffect, useState, useRef } from "react";
import { useAuth } from "../services/auth/useAuth";
import { useParams, useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";

export default function ChatPage() {
  const { getMessages, sendMessage, createChat } = useAuth();
  const { org, agentId, chatId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTypingBubble, setShowTypingBubble] = useState(false);

  const bottomRef = useRef(null);

  // Load messages if chat exists
  useEffect(() => {
    if (!chatId) return;
    async function loadMessages() {
      try {
        const data = await getMessages(chatId);
        setMessages(data.messages);
        setTitle(data.chat_title);
      } catch (err) {
        console.error(err);
      }
    }
    loadMessages();
  }, [chatId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTypingBubble]);

  // Stream bot message character by character
  const streamBotMessage = (text) => {
    let i = 0;
    setShowTypingBubble(false); // stop typing dots
    const botMsg = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, botMsg]);

    const intervalId = setInterval(() => {
      i++;
      botMsg.content = text.slice(0, i);
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { ...botMsg };
        return newMsgs;
      });
      if (i >= text.length) clearInterval(intervalId);
    }, 20); // typing speed
  };

  const handleSend = async () => {
    if (!input.trim() || !agentId || loading) return;

    let activeChatId = chatId;

    // Create chat if not exists
    if (!activeChatId) {
      try {
        const chat = await createChat(agentId);
        activeChatId = chat.id;
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

    setShowTypingBubble(true); // start dots

    try {
      const res = await sendMessage(activeChatId, input);
      streamBotMessage(res.answer); // stream response
    } catch (err) {
      console.error(err);
      setShowTypingBubble(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container flex h-screen">
      <ChatSidebar agentId={agentId} />

      <div className="chat-main flex flex-col flex-1">
        <div className="chat-header px-5 py-3 border-b border-gray-300 font-semibold">
          Agent {agentId} {title ? `| ${title}` : "| New Chat"}
        </div>

        {!chatId ? (
          <div className="empty-state flex-1 flex items-center justify-center text-gray-500">
            Start a new conversation
          </div>
        ) : (
          <div className="chat-messages flex-1 flex flex-col gap-2 overflow-y-auto p-5">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`relative px-5 py-3 rounded-2xl shadow-sm break-words text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "self-end bg-gray-800 text-white"
                    : "self-start bg-gray-200 text-gray-900"
                }`}
                style={{
                  maxWidth: "75%",
                  width: "fit-content",
                  minWidth: "50px",
                  opacity: 0,
                  animation: "fadeIn 0.2s forwards",
                }}
              >
                {msg.content}
              </div>
            ))}

            {showTypingBubble && (
              <div className="typing-bubble self-start">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        )}

        <div className="chat-input flex p-4 border-t border-gray-300">
          <input
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message..."
          />
          <button
            className="ml-3 px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            to { opacity: 1; }
          }

          .typing-bubble {
            display: flex;
            gap: 4px;
            padding: 10px 14px;
            border-radius: 20px;
            background-color: #e0e0e0;
            max-width: 80px;
            min-width: 40px;
          }

          .dot {
            width: 8px;
            height: 8px;
            background-color: #555;
            border-radius: 50%;
            animation: bounce 1s infinite;
          }

          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }

          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}