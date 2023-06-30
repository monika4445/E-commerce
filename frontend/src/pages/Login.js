import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/products/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [verifiedError, setVerifiedError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const payl = useSelector((state) => state.payl);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (payl !== null && payl?.is_verified === 1 && !storedUser) {
      localStorage.setItem("user", JSON.stringify(payl));

     
    } else if (payl?.is_verified === 0 && !storedUser) {
      setVerifiedError("Confirm Email Verification");
    }
  }, [payl, navigate]);

  function loginUser(e) {
    e.preventDefault();

    dispatch(login({ user }));
    setUser({ email: "", password: "" });
    navigate("/");
    alert(`Successfully logged in`);

  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setVerifiedError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [verifiedError]);

  return (
    <div className="form-bd">
      <div className="form-wrapper">
        <div className="form-container">
          <h1>Log In</h1>
          <form onSubmit={loginUser}>
            <div className="form-control">
              <input
                type="text"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, email: e.target.value }))
                }
                value={user.email}
                required
                placeholder="Email"
              />
            </div>

            <div className="form-control">
              <input
                type="password"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, password: e.target.value }))
                }
                value={user.password}
                required
                placeholder="Password"
              />
            </div>

            <button className="login-btn">Login</button>
            <p className="text">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
      {verifiedError && (
        <div className="verify">
          <p>{verifiedError}</p>
        </div>
      )}
    </div>
  );
}

export default Login;
