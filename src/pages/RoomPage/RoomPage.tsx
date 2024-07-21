import { useEffect, useState } from "react";
import ChatLayout from "../../components/Layout/ChatLayout";
import getDataSession from "../../utils/session";
import { Link } from "react-router-dom";
import { Header } from "../../components/Element/Header";
import UserList from "../../components/Element/UserList";
import { getSocket } from "../../socket/socket";
import { useSocket } from "../../context/socketContext";

interface LastMessage {
  content: string;
  createdAt: string;
}

interface User {
  id: number;
  username: string;
  name: string;
}

interface RoomList {
  id: number;
  lastMessage: LastMessage;
  users: User[];
}

const RoomPage = () => {
  const [roomList, setRoomList] = useState<RoomList[]>([]);
  const { socket } = useSocket();
  const session = getDataSession();

  useEffect(() => {
    if (!socket) return;
    socket.connect();
    socket.emit("joinRoom", { activeUserIds: [session?.userId] });

    socket.on("roomList", (rooms: any) => {
      const filteredRoomList = rooms.map((room: { lastMessage: LastMessage; users: User[] }) => ({
        ...room,
        lastMessage: {
          ...room.lastMessage,
          createdAt: `${new Date(room.lastMessage.createdAt).getHours().toString().padStart(2, "0")}:${new Date(room.lastMessage.createdAt).getMinutes().toString().padStart(2, "0")}`,
        },
        users: room.users.filter((user) => user.id !== session?.userId),
      }));

      setRoomList(filteredRoomList);
    });

    socket.on("activeRoom", (room: any) => {
      updateRoomInList(room);
    });

    const updateRoomInList = (updatedRoom: RoomList) => {
      setRoomList((prevRoomList) => {
        // Check if the room already exists in roomList
        const existingIndex = prevRoomList.findIndex((room) => room.id === updatedRoom.id);

        if (existingIndex !== -1) {
          // Room already exists, move it to the top
          const updatedRoomList = [...prevRoomList];
          updatedRoomList.splice(existingIndex, 1);
          updatedRoomList.unshift({
            ...updatedRoom,
            lastMessage: {
              ...updatedRoom.lastMessage,
              createdAt: `${new Date(updatedRoom.lastMessage.createdAt).getHours().toString().padStart(2, "0")}:${new Date(updatedRoom.lastMessage.createdAt).getMinutes().toString().padStart(2, "0")}`,
            },
            users: updatedRoom.users.filter((user: User) => user.id !== session?.userId),
          });
          return updatedRoomList;
        } else {
          // Room does not exist, add it to the beginning
          return [
            {
              ...updatedRoom,
              lastMessage: {
                ...updatedRoom.lastMessage,
                createdAt: `${new Date(updatedRoom.lastMessage.createdAt).getHours().toString().padStart(2, "0")}:${new Date(updatedRoom.lastMessage.createdAt).getMinutes().toString().padStart(2, "0")}`,
              },
              users: updatedRoom.users.filter((user: User) => user.id !== session?.userId),
            },
            ...prevRoomList,
          ];
        }
      });
    };

    return () => {
      socket.off("joinRoom");
      socket.off("roomList");
      socket.off("activeRoom");
      socket.disconnect();
    };
  }, [socket]);
  return (
    <ChatLayout>
      <Header title="ChatApp" />
      <div className="mt-20 text-start">
        <ul>
          {roomList.map((room) => (
            <Link to={`/chat/${room.id}?name=${room.users[0].name}`} key={room.id}>
              <UserList name={room.users[0].name} description={room.lastMessage.content} createdAt={room.lastMessage.createdAt} />
            </Link>
          ))}
        </ul>
      </div>
      <Link to="/users" className="flex items-center justify-center absolute bottom-10 right-5 w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-4xl shadow-lg hover:opacity-80 duration-300">
        +
      </Link>
    </ChatLayout>
  );
};

export default RoomPage;
