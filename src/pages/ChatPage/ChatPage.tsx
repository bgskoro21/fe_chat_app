import { useEffect, useRef, useState } from "react";
import ChatLayout from "../../components/Layout/ChatLayout";
import { Header } from "../../components/Element/Header";
import getDataSession from "../../utils/session";
import { useLocation, useParams } from "react-router-dom";
import { useSocket } from "../../context/socketContext";

interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  chatRoomId: number;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const user = getDataSession();
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.emit("joinedRoom", { chatRoomId: parseInt(params.chatRoomId ?? "0", 10) });

    socket.on("messageList", (messageList: any) => {
      setMessages(messageList);
    });

    socket.on("message", (message: any) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("users");
      socket.off("message");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (message != "") {
      socket.emit("message", {
        senderId: parseInt(user?.userId, 10),
        chatRoomId: parseInt(params.chatRoomId ?? "0", 10),
        content: message,
      });
      setMessage("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const resizeTextarea = () => {
        inputRef.current!.style.height = "auto";
        inputRef.current!.style.height = `${inputRef.current!.scrollHeight}px`;
      };

      inputRef.current.addEventListener("input", resizeTextarea);
      resizeTextarea(); // Initial call to set the height

      return () => {
        inputRef.current?.removeEventListener("input", resizeTextarea);
      };
    }
  }, [messages]);
  return (
    <ChatLayout>
      <Header showBackButton title={searchParams.get("name") ?? ""} />
      <div className="flex-1 w-full overflow-y-auto no-scrollbar">
        <ul className="mt-16">
          {messages.map((msg, index) => (
            <li key={index} className={`p-2 break-words ${msg.senderId === user?.userId ? "text-right" : "text-left"}`}>
              <span className={`inline-block px-2 py-1 ${msg.senderId === user?.userId ? "bg-gray-300 rounded-tl-lg rounded-tr-lg rounded-bl-lg" : "bg-blue-600 rounded-tl-lg text-white rounded-br-lg rounded-tr-lg"}`}>{msg.content}</span>
            </li>
          ))}
          <div ref={messagesEndRef}></div>
        </ul>
      </div>
      <form onSubmit={sendMessage} className="fixed bottom-0 left-0 right-0 p-4  flex items-center lg:max-w-[400px] lg:left-[480px] 2xl:left-[760px]">
        <textarea
          ref={inputRef}
          className="flex-1 p-3 border border-gray-300 rounded-full mr-2 resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          rows={1}
          style={{ overflow: "hidden" }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(e as unknown as React.FormEvent);
            }
          }}
        />
        <button type="submit" className="p-3 bg-blue-500 text-white rounded-full">
          Send
        </button>
      </form>
    </ChatLayout>
  );
};

export default ChatPage;
