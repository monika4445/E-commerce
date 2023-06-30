import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { register } from "../features/products/userSlice";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import './Register.css';

function Register() {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: ""
  });
  const [registered, setRegistered] = useState(false);
  const dispatch = useDispatch();
  const { userInStorage } = useLocalStorage();

  function registerUser(e) {
    e.preventDefault();
    dispatch(register({ user })).then((res) => {
      setRegistered(true);
    });
    setUser({ userName: "", email: "", password: "" });
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setRegistered(false);
    }, 3000); 
    
    return () => clearTimeout(timer);
  });

  return (
    <div className="form-bd">
      <div className="form-wrapper">
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={registerUser}>
            <div className="form-control">
              <input
                type="text"
                onChange={(e) =>
                  setUser((prev) => ({ ...prev, userName: e.target.value }))
                }
                value={user.userName}
                required
                placeholder="UserName"
              />
            </div>
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
            <button className="login-btn">Register</button>
            <p className="text">
              Have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
      {userInStorage && registered ? (
        <div className="registration-success">
          <p>You have successfully registered! Confirm Email</p>
        </div>
      ) : null}
    </div>
  );
}

export default Register;
