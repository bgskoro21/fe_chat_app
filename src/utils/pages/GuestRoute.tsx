import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem("access_token");
  return !token ? children : <Navigate to="/" />;
};

export default GuestRoute;
