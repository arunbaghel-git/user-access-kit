import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';
import axios from 'axios';
import { AppContext } from "../api/AppContext.jsx";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();
  const {backendUrl,setIsLoggedin, getUserData} = useContext(AppContext);
  const onSubmitHandler =async (e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl + "/api/login",{email,password});
      if(data.success){
        toast.success(data.message);
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <>
      <div className="d-flex f-dir-col a-center r-gap">
        <h2>Login user</h2>
        <form className="form" onSubmit={onSubmitHandler}>
          <label htmlFor="email">email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="enter email"
            className="inp"
            required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="enter password"
            className="inp"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <button type="submt" className="btn btn-primary">
            login
          </button>
        </form>
        <p>
          don't have an account ?
          <span onClick={() => navigate("/register")} className="point">
            register
          </span>
        </p>
      </div>
    </>
  );
};
export default Login;
