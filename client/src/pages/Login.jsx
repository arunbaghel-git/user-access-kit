import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="d-flex f-dir-col a-center r-gap">
        <h2>Login user</h2>
        <form className="form">
          <label htmlFor="email">email</label>
          <input
            type="email"
            name="email"
            id=""
            placeholder="enter email"
            className="inp"
            required
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id=""
            placeholder="enter password"
            className="inp"
            required
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
