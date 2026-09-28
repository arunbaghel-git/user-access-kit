import { useState } from "react";
import { useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("EMAIL_SCREEN");
  const navigate = useNavigate();
  const onEmailHandler = (e) => {
    e.preventDefault();
    setStep("OTP_SCREEN");
  };
  const onOtpHandler = (e) => {
    e.preventDefault();
    setStep("PASSWORD_SCREEN");
  };
  const onPasswordHandler = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  return (
    <>
      <div className="d-flex a-center f-dir-col r-gap">
        {/* send password opt */}
        {step === "EMAIL_SCREEN" && <h2>Send Password Otp</h2>}
        {step === "OTP_SCREEN" && <h2>Enter Otp</h2>}
        {step === "PASSWORD_SCREEN" && <h2>Enter new password</h2>}
        {step === "EMAIL_SCREEN" && (
          <form onSubmit={onEmailHandler} className="form">
            <label htmlFor="email">email</label>
            <input
              type="email"
              name="email"
              id=""
              placeholder="enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inp"
            />
            <button type="submt" className="btn btn-primary">submit</button>
          </form>
        )}
        {/* enter otp */}
        {step === "OTP_SCREEN" && (
          <form onSubmit={onOtpHandler} className="form">
            <label htmlFor="otp">Otp</label>
            <input
              type="text"
              name="otp"
              id=""
              placeholder="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="inp"
            />
            <button type="submt" className="btn btn-primary">submit</button>
          </form>
        )}
        {/* new password */}
        {step === "PASSWORD_SCREEN" && (
          <form onSubmit={onPasswordHandler} className="form">
            <label htmlFor="password">new password</label>
            <input
              type="password"
              name="password"
              id=""
              placeholder="new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inp"
            />
            <button type="submt" className="btn btn-danger">reset</button>
          </form>
        )}
      </div>
    </>
  );
};
export default ResetPassword;
