import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "../../config/Config";

const validationSchema = Yup.object().shape({
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Password: Yup.string().required("Password is required"),
});

const isDisabledSchema = Yup.object().shape({
  Email: Yup.string().required("Email is required"),
  Password: Yup.string().required("Password is required"),
});

const loginUser = async (FormData: any) => {
  const response = await axios.post(`${apiUrl}/bkeep/users/signin`, FormData);
  return response.data;
};

function Login() {
  const navigate = useNavigate();
  const [isLoading2, setisLoginDisabled] = useState(false);
  const intialFormData = {
    Email: "",
    Password: "",
  };

  const [formData, setFormData] = useState(intialFormData);

  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: (data) => {
      localStorage.clear();
      document.cookie = `token=${data.token}`;
      toast.success("Login successful!");
      window.setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(error.response.data.message);
      console.error("Error:", error.response);
    },
    onSettled: () => {
      setisLoginDisabled(false);
    },
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      document.cookie = "";
      await validationSchema.validate(formData, { abortEarly: false });
      mutate(formData);
    } catch (error: any) {
      console.log(error.errors);
      toast.dismiss();
      toast.error(Object.values(error.errors).join("\n"));
    }
  };

  const isSubmitDisabled = () => {
    try {
      isDisabledSchema.validateSync(formData, { abortEarly: false });
      return false;
    } catch (error) {
      return true;
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      localStorage.clear();
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              // Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setisLoginDisabled(true);
          document.cookie = "";
          axios
            .post(`${apiUrl}/auth/google/callback`, res.data)
            .then((res2) => {
              document.cookie = `token=${res2.data.token}`;
              localStorage.clear();
              window.location.href = `/dashboard`;
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    },
    onError: (error) => console.log("Login Failed:", error),
  });
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-slate shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <div className="flex flex-col justify-center p-8 md:p-14">
          <form action="" onSubmit={handleSubmit}>
            <div className="mb-3 text-4xl font-bold">Welcome back</div>
            <span className="font-light text-gray-400 mb-8">
              Welcom back! Please enter your details
            </span>
            <div className="py-4">
              <label className="mb-2 text-md">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                name="Email"
                id="email"
                value={formData.Email}
                onChange={handleInputChange}
              />
            </div>
            <div className="py-4">
              <span className="mb-2 text-md">Password</span>
              <input
                type="Password"
                name="Password"
                id="password"
                value={formData.Password}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              />
            </div>
            <div className="flex justify-between w-full py-4">
              <div className="mr-24">
                <input type="checkbox" name="ch" id="ch" className="mr-2" />
                <label htmlFor="" className="text-md">
                  Remember me
                </label>
              </div>
              <span className="font-bold text-md">Forgot password</span>
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitDisabled() || isLoading}
              className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            >
              {isLoading ? <p>Logging in ...</p> : <p>Log in</p>}
            </button>
            <button
              type="submit"
              onClick={() => login()}
              disabled={isLoading}
              className="w-full border border-gray-300 text-md p-2 rounded-lg mb-6 hover:bg-black hover:text-white"
            >
              <svg
                className="w-6 h-6 inline mr-2"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1784_115)">
                  <path
                    d="M4.43242 12.0862L3.73625 14.6852L1.19176 14.739C0.431328 13.3286 0 11.7148 0 10C0 8.34176 0.403281 6.77801 1.11812 5.40109H1.11867L3.38398 5.8164L4.37633 8.06812C4.16863 8.67363 4.05543 9.32363 4.05543 10C4.05551 10.7341 4.18848 11.4374 4.43242 12.0862Z"
                    fill="#FBBB00"
                  />
                  <path
                    d="M19.8253 8.13187C19.9401 8.7368 20 9.36152 20 10C20 10.7159 19.9247 11.4143 19.7813 12.0879C19.2945 14.3802 18.0225 16.3819 16.2605 17.7984L16.2599 17.7978L13.4066 17.6522L13.0028 15.1313C14.172 14.4456 15.0858 13.3725 15.5671 12.0879H10.2198V8.13187H19.8253Z"
                    fill="#518EF8"
                  />
                  <path
                    d="M16.2599 17.7978L16.2604 17.7984C14.5467 19.1758 12.3698 20 10 20C6.19177 20 2.8808 17.8714 1.19177 14.739L4.43244 12.0863C5.27693 14.3401 7.45111 15.9445 10 15.9445C11.0956 15.9445 12.122 15.6484 13.0027 15.1313L16.2599 17.7978Z"
                    fill="#28B446"
                  />
                  <path
                    d="M16.383 2.30219L13.1434 4.95437C12.2319 4.38461 11.1544 4.05547 10 4.05547C7.39344 4.05547 5.17859 5.73348 4.37641 8.06812L1.11871 5.40109H1.11816C2.78246 2.1923 6.1352 0 10 0C12.4264 0 14.6511 0.864297 16.383 2.30219Z"
                    fill="#F14336"
                  />
                </g>
                <defs>
                  /{" "}
                  <clipPath id="clip0_1784_115">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              {isLoading2 ? (
                <div>Redirecting...</div>
              ) : (
                <div>Signin with Google</div>
              )}
            </button>
            <div className="text-center text-gray-400">
              Don't have an account?
              <span className="font-bold text-black">
                <Link to="/register"> Create an account</Link>
              </span>
            </div>
          </form>
        </div>
        <div className="relative">
          <img
            src="image.jpg"
            alt="img"
            className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
          />

          <div className="absolute hidden bottom-10 right-6 p-6 bg-slate-900 bg-opacity-10 backdrop-blur-sm rounded drop-shadow-lg md:block">
            <span className="text-white text-xl">
              Experience seamless customers and orders management and increased
              productivity with our user-friendly platform, designed to meet the
              needs of tailors of all sizes."
            </span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
