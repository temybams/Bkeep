import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "react-query";
import { toast, ToastContainer } from 'react-toastify';
import { apiUrl } from "../../config/Config";
import LogoutButton from "../../components/logout";

const token = document.cookie.split("=")[1];
const logotUser = async () => {
  console.log("token", token);
  const response = await axios.post(
    `${apiUrl}/bkeep/users/signout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

function clearCookies() {
  // Clear all cookies by setting their expiration date to a past date
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const cookieName = cookie.split("=")[0];
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const user = {
    name: "",
    profilePic: "https://via.placeholder.com/150",
  };

  const { mutate, isLoading } = useMutation(logotUser, {
    onSuccess: () => {
      clearCookies();
      localStorage.clear();
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error("Error:", error.response);
    },
  });
  const handleLogOut = () => {
    // googleLogout();
    document.cookie = "";
    mutate();
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton onClick={handleLogOut} />
      </div>
      <div className="flex items-center">
        <img
          src={user.profilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4"
        />
        <p className="text-lg font-semibold">{user.name}</p>
      </div>
     
    </div>
  );
};

export default Dashboard;
