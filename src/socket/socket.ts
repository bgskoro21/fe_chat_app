// socket.ts
import { io } from "socket.io-client";
import { API_URL } from "../utils/constants/constants";
import axios from "axios";

let socket: any;

export const initializeSocket = (token: string) => {
  socket = io(API_URL, {
    query: {
      token,
    },
  });

  socket.on("connect_error", async (error: any) => {
    if (error.message === "Token expired!") {
      // Handle token refresh
      const existingRefreshToken = localStorage.getItem("refresh_token");
      try {
        const response = await axios.post(`${API_URL}/api/users/auth/refresh`, {
          refresh_token: existingRefreshToken,
        });
        const { token, refreshToken } = response.data.data;
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        // Reconnect with new token
        socket.io.opts.query = {
          token: token,
        };
        socket.connect();
      } catch (refreshError) {
        console.error("Unable to refresh token", refreshError);
      }
    }
  });

  return socket;
};

export const getSocket = () => socket;
