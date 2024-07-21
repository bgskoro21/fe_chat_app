import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEllipsisV, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";

export const Header = ({ title, showBackButton = false }: { title: string; showBackButton?: boolean }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(true);
  const navigate = useNavigate();
  const handleLogout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token") ?? "";
      const response = await axiosInstance.post("/api/users/logout", { refreshToken });

      if (response.status === 200) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    } catch (e) {
      console.error(`Something error: ${e}`);
    }
  };
  return (
    <div className="flex items-center justify-between p-4 absolute left-0 top-0 h-16 w-full border border-b-slate-300 shadow-md bg-slate-100">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} className="text-blue-600 cursor-pointer hover:text-blue-800 duration-300 text-lg" />
          </Link>
        )}
        <h1 className="text-2xl font-bold text-blue-500">{title}</h1>
      </div>
      <FontAwesomeIcon icon={faEllipsisV} className="text-blue-600 cursor-pointer hover:text-blue-700 duration-300 text-lg" onClick={() => setIsOpenDropdown(!isOpenDropdown)} />
      <div className={`absolute right-0 rounded-lg -bottom-[50px] w-40 p-3 bg-white shadow-lg border border-slate-200 ${isOpenDropdown ? "hidden" : "block"}`}>
        <ul>
          <li className="flex items-center gap-3 group cursor-pointer" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="text-blue-600 group-hover:text-blue-800 duration-300" />
            <span className="text-blue-600 group-hover:text-blue-800 duration-300">Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
