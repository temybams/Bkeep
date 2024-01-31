import axios from "axios";
import { useEffect } from "react";
import Login from "../pages/Login/login";
import { apiUrl } from "../config/Config";

function LoginScreen() {
  const startServer = async () => {
    try {
      await axios.get(apiUrl);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    startServer();
  }, []);
  return (
    <div>
      <Login />
    </div>
  );
}

export default LoginScreen;
