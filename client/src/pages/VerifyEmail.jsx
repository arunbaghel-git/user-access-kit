import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../api/AppContext";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const { backendUrl,getUserData,userData,isloggedin } = useContext(AppContext);
  const navigate = useNavigate();
  const onOtpHandler = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + "/api/verify-account", {
        otp,
      });
      console.log(data);
      if (data.success) {
        navigate("/");
        getUserData();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(()=>{
    isloggedin && userData && userData.isAccountVerified && navigate("/");
  },[isloggedin,userData])
  return (
    <>
      <h2>verify email</h2>
      <div>
        <form onSubmit={onOtpHandler}>
          <label htmlFor="otp"></label>
          <input
            type="text"
            value={otp}
            onChange={(e) => {setOtp(e.target.value)
            }}
          />
          <button className="btn btn-success">submit</button>
        </form>
      </div>
    </>
  );
};
export default VerifyEmail;
