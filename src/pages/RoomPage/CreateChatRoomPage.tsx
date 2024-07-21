import ChatLayout from "../../components/Layout/ChatLayout";
import { Header } from "../../components/Element/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserList from "../../components/Element/UserList";
import Loading from "../../components/Element/Loading";
import getDataSession from "../../utils/session";
import axiosInstance from "../../axios/axiosInstance";

const CreateChatRoomPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const session = getDataSession();

  const getUsers = async () => {
    const response = await axiosInstance.get("/api/users");
    if (response.status === 200) {
      setUsers(response.data.data);
    }
  };
  useEffect(() => {
    setIsLoading(true);
    getUsers();
    setIsLoading(false);
  }, []);

  const handleClickList = async (user: any) => {
    try {
      const payload = {
        senderId: session?.userId,
        receiverId: user.Id,
      };
      const response = await axiosInstance.post("/api/chat", payload);

      if (response.status === 201) {
        navigate(`/chat/${response.data.data.id}?name=${user.name}`);
      }
    } catch (e) {
      console.error(`Error fetching data: ${e}`);
    }
  };
  return (
    <ChatLayout>
      <Header title="User Search" showBackButton />
      <div className="mt-20">
        <ul>{isLoading ? <Loading /> : users.map((user) => <UserList onClick={() => handleClickList(user)} name={user.name} description="Hi there, I'm using ChatApp!" key={user.Id} />)}</ul>
      </div>
    </ChatLayout>
  );
};

export default CreateChatRoomPage;
