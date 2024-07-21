import { jwtDecode } from "jwt-decode";

const getDataSession = () => {
  const token = localStorage.getItem("access_token");

  if (token) {
    const decodedToken: any = jwtDecode(token);
    return {
      userId: decodedToken.sub,
      userName: decodedToken.username,
    };
  }

  return null;
};

export default getDataSession;
