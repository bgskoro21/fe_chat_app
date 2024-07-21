import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  handleSubmit: (e: any) => void;
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ handleSubmit, children }) => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">ChatApp</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto w-full p-6">
        {children}
      </form>
    </div>
  );
};

export default AuthLayout;
