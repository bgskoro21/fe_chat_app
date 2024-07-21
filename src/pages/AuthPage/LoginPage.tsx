import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/constants/constants";
import AuthLayout from "../../components/Layout/AuthLayout";
import Input from "../../components/Element/Input";
import Button from "../../components/Element/Button";
import TextLink from "../../components/Element/TextLink";
import axiosInstance from "../../axios/axiosInstance";
import { initializeSocket } from "../../socket/socket";

interface LoginRequest {
  username: string;
  password: string;
}

interface DataResponse {
  username: string;
  name: string;
  token: string;
}

interface LoginResponse {
  data: DataResponse;
}

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        username,
        password,
      });

      const { token, refreshToken } = response.data.data;
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refreshToken);
      initializeSocket(token);
      navigate("/");
    } catch (error) {
      console.error(`Error Login: ${error}`);
    }
  };
  return (
    <AuthLayout handleSubmit={handleLogin}>
      <div className="mb-5">
        <Input id="username" type="text" labelText="Your username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="mb-5">
        <Input id="password" type="password" labelText="Your password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button />
      <div className="mt-3">
        <TextLink text="Dont have an account?" href="/register" linkText="Sign Up!" />
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
