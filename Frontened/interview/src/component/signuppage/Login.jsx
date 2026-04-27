import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "http://localhost:5001";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Handle input change
  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // LOGIN API
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { withCredentials: true, timeout: 10000 }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      }));
      alert("Login successful");
      
      if (res.data.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP API
  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          name: formData.fullname.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        },
        { withCredentials: true, timeout: 10000 }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
      }));
      alert("Signup successful");
      navigate("/", { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (isSignup && formData.fullname.trim().length < 2) {
      setError("Please enter a valid full name");
      return false;
    }

    const email = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (isSignup && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    if (isSignup) {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  const handleModeToggle = () => {
    setIsSignup((prev) => !prev);
    setError("");
    resetForm();
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        
        {/* Animated Logo Section */}
        <div className="login-logo-container">
          <div className="logo-glow-ring"></div>
          <img src="/logo.png" alt="InterviewAce Logo" className="login-logo-img" />
        </div>

        <h1>{isSignup ? "Sign Up" : "Login"}</h1>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={handleModeToggle}>
            {isSignup ? " Login here" : " Sign Up"}
          </span>
        </p>

        <div className="admin-access">
          <p>Are you an Admin? <span onClick={() => navigate("/login")}>Click here to Login</span></p>
          <p style={{fontSize: '12px', marginTop: '5px', opacity: 0.7}}>Admin access is restricted to authorized personnel.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
