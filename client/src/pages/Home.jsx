import { useContext } from "react";
import { AppContext } from "../api/AppContext";

const Home = () => {
  const {userData} = useContext(AppContext);
  return (
    <>
      <h1 className="t-center">
       { userData ? `Hello ${userData.name} Welcome to Software Developemt` : `Hello developer Welcome to Software Developemt` }
      </h1>
    </>
  );
};
export default Home;
