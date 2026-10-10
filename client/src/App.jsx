import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx"
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Navbar from "./components/Navbar.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <> 
    <div className="main">
    <Navbar/>
    <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element= {<VerifyEmail/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
      </div>
      
    </>
  );
}

export default App;
