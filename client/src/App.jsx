import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResetPassword from "./pages/ResetPassword.jsx"
import Navbar from "./components/Navbar.jsx";
function App() {
  return (
    <>
    <div className="main">
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
      </Routes>
      </div>
      
    </>
  );
}

export default App;
