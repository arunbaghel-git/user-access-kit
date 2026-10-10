import { useContext } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../api/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
const Navbar = () => {
  const { backendUrl, userData, setUserData, setIsLoggedin } =
    useContext(AppContext);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const sendVerifyEmail = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/send-verify-otp");
      if (data.success) {
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const onLogoutHandler = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/logout");
      if (data.success) {
        navigate("/");
        setIsLoggedin(false);
        setUserData(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="nav-bar d-flex j-btw a-center">
        <Link to="/" className="left">
          <img src="#" alt="Logo" />
        </Link>
        {userData ? (
          <div className="right d-flex a-center j-end c-gap">
            <span>{userData.name}</span>
            <div>
              {!userData.isAccountVerified ? (
                <ul>
                  <li onClick={sendVerifyEmail} className="point">
                    verify email
                  </li>
                  <li onClick={onLogoutHandler} className="point">
                    Logout
                  </li>
                </ul>
              ) : (
                <button onClick={onLogoutHandler} className="point">
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="right d-flex j-end">
            <button
              className="btn btn-success"
              onClick={() => navigate("/login")}
            >
              login
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default Navbar;
