import { createBrowserRouter } from "react-router-dom";
import ChatPage from "../pages/ChatPage/ChatPage.tsx";
import LoginPage from "../pages/AuthPage/LoginPage.tsx";
import PrivateRoute from "../utils/pages/PrivateRoute.tsx";
import GuestRoute from "../utils/pages/GuestRoute.tsx";
import RoomPage from "../pages/RoomPage/RoomPage.tsx";
import CreateChatRoomPage from "../pages/RoomPage/CreateChatRoomPage.tsx";
import RegisterPage from "../pages/AuthPage/RegisterPage.tsx";
import { SocketProvider } from "../context/socketContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <SocketProvider>
          <RoomPage />
        </SocketProvider>
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <RegisterPage />
      </GuestRoute>
    ),
  },
  {
    path: "/chat/:chatRoomId",
    element: (
      <PrivateRoute>
        <SocketProvider>
          <ChatPage />
        </SocketProvider>
      </PrivateRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <PrivateRoute>
        <CreateChatRoomPage />
      </PrivateRoute>
    ),
  },
]);

export default router;
