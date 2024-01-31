import axios from "axios";
import { useEffect } from "react";
import Register from "../pages/Register/register";
import { apiUrl } from "../config/Config";

const RegisterScreen = function RegisterScreen() {
  const startServer = async () => {
    try {
      await axios.get(apiUrl);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() =>{
    startServer();
  }, []);
  return <div><Register/></div>;
};

export default RegisterScreen;
