import "./Navbar.css"
import {Link} from "react-router-dom"
const Navbar = () => {
  return <>
  <div className="nav-bar d-flex j-btw a-center">
    
      <Link to="/" className="left"><img src="" alt="Logo" /></Link>
    <div className="right d-flex a-center j-end c-gap">
      <span>Arun</span>
      <button className="btn btn-danger">Logout</button>
    </div>
  </div>
  </>;
};
export default Navbar;
