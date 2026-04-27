import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
      if (res.data.role === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        setToken(res.data.token);
      } else {
        setError("Not authorized as an admin");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Admin Portal</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
