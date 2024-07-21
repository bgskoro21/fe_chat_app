import React from "react";

interface UserListProps {
  name: string;
  description: string;
  createdAt?: string;
  onClick?: () => void;
}

const UserList: React.FC<UserListProps> = ({ name, description, createdAt, onClick }) => {
  return (
    <li onClick={onClick} className="flex items-center justify-between h-14 border-b-2 border-b-slate-200 hover:cursor-pointer hover:bg-slate-200 duration-300">
      <div className="flex items-center w-3/4 gap-5">
        <div className="w-10">
          <div className="flex items-center justify-center text-white text-2xl h-10 w-10 bg-blue-500 rounded-full">B</div>
        </div>
        <div className="flex flex-col w-3/4">
          <span>{name}</span>
          <span className="w-full text-sm text-slate-400 overflow-hidden overflow-ellipsis whitespace-nowrap">{description}</span>
        </div>
      </div>
      <span className="text-end text-sm text-blue-600">{createdAt}</span>
    </li>
  );
};

export default UserList;
