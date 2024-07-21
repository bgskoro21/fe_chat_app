import React, { useState } from "react";
import AuthLayout from "../../components/Layout/AuthLayout";
import Input from "../../components/Element/Input";
import Button from "../../components/Element/Button";
import TextLink from "../../components/Element/TextLink";
import { API_URL } from "../../utils/constants/constants";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";

const RegisterPage = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/register", {
        username,
        name,
        password,
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (e) {
      console.error(`Error when register user: ${e}`);
    }
  };
  return (
    <AuthLayout handleSubmit={handleSubmit}>
      <div className="mb-5">
        <Input id="name" type="text" labelText="Your name" onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mb-5">
        <Input id="username" type="text" labelText="Your Username" onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="mb-5">
        <Input id="password" type="text" labelText="Your Password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button />
      <div className="mt-3">
        <TextLink text="Do you have an account?" href="/login" linkText="Sing In!" />
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
