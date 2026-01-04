import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import rvceLogo from "../assets/rvce_logo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      saveAuth(res.data.token, res.data.role);

      if (res.data.role === "STUDENT") navigate("/student");
      else if (res.data.role === "FACULTY") navigate("/faculty");
      else if (res.data.role === "ADMIN") navigate("/admin");
      else if (res.data.role === "COMPANY") navigate("/company");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={pageStyle}>
      {/* RVCE LOGO */}
      <img src={rvceLogo} alt="RVCE Logo" style={logoStyle} />

      <div style={contentStyle}>
        <h2 style={collegeNameStyle}>R V College of Engineering</h2>

        <h1 style={titleStyle}>
          College Research Project Management System
        </h1>

        {/* LOGIN CARD */}
        <div style={loginCardStyle}>
          {error && <p style={errorStyle}>{error}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* 🔹 STYLES */

const pageStyle = {
  minHeight: "100vh",
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  width: "100%",
  fontFamily: "Arial, sans-serif",
};

const logoStyle = {
  position: "absolute",
  top: "20px",
  left: "20px",
  height: "60px",
};

const contentStyle = {
  width: "100%",
  textAlign: "center",
  padding: "20px",
};

const collegeNameStyle = {
  color: "#0a2a66",
  marginBottom: "8px",
  fontWeight: "600",
};

const titleStyle = {
  color: "#000",
  marginBottom: "50px",
  fontSize: "40px",
  lineHeight: "1.2",
};

const loginCardStyle = {
  width: "400px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#f4f6fa", // 🔹 subtle different colour
  borderRadius: "10px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

/*const inputStyle = {
  width: "100%",
  padding: "14px", // 🔹 same as button
  marginBottom: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
  backgroundColor: "#ffffff", // 🔹 white fields
};*/
const inputStyle = {
  width: "100%",
  height: "44px",          // ✅ FIXED HEIGHT
  padding: "0 12px",
  marginBottom: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
  color: "#000000",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
};

/*const buttonStyle = {
  width: "100%",
  padding: "14px", // 🔹 SAME HEIGHT AS INPUT
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
};*/
const buttonStyle = {
  width: "100%",
  height: "44px",          // ✅ SAME HEIGHT AS INPUT
  backgroundColor: "#0a2a66",
  color: "#ffffff",
  border: "none",
  borderRadius: "6px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxSizing: "border-box",
};



const errorStyle = {
  color: "#b00020",
  marginBottom: "15px",
  fontSize: "14px",
};

export default Login;
