import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../api/AppContext";
import {toast} from 'react-toastify';
import axios from "axios";
const Register = () => {
  const [name, setName]= useState('');
  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
   const {backendUrl,setIsLoggedin} = useContext(AppContext);
    const onSubmitHandler =async (e)=>{
      e.preventDefault();
      axios.defaults.withCredentials = true;
      try {
        const {data} = await axios.post(backendUrl + "/api/register",{name,email,password})
       if (data.success) 
        {
          setIsLoggedin(true);
          toast.success(data.message); 
          navigate('/login');
      }
      else{
        toast.error(data.message);
      }
    } catch (error) { 
        toast.error(error.message)
      }
    }
  return (
    <>
      <div className="d-flex f-dir-col a-center r-gap">
        <h2>Register user</h2>
        <form className="form" onSubmit={onSubmitHandler}>
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="enter name"
            className="inp"
            required
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
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
            register
          </button>
        </form>
        <p>
          already have an account ?
          <span onClick={() => navigate("/login")} className="point">
            login
          </span>
        </p>
      </div>
    </>
  );
};

export default Register;
