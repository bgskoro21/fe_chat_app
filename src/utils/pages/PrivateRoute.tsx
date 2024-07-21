import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: any }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
