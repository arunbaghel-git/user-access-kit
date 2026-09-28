import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="d-flex f-dir-col a-center r-gap">
        <h2>Register user</h2>
        <form className="form">
          <label htmlFor="name">name</label>
          <input
            type="text"
            name="name"
            placeholder="enter name"
            className="inp"
            required
          />
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
