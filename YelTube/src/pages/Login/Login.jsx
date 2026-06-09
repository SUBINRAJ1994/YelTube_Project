import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" or "signup"

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill all fields");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const savedUser = users.find((u) => u.email === loginEmail && u.password === loginPassword);

    if (savedUser) {
      if (savedUser.banned) {
        alert("This account has been banned by the administrator.");
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(savedUser));
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful!");
      window.location.href = "/";
    } else {
      // Fallback for legacy single user
      const storedData = localStorage.getItem("yeltubeUser");
      const legacyUser = storedData ? JSON.parse(storedData) : null;
      if (
        legacyUser &&
        legacyUser.email === loginEmail &&
        legacyUser.password === loginPassword
      ) {
        localStorage.setItem("currentUser", JSON.stringify(legacyUser));
        localStorage.setItem("isLoggedIn", "true");
        alert("Login successful!");
        window.location.href = "/";
      } else {
        alert("Invalid email or password");
      }
    }
  };

  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      alert("Please fill all fields");
      return;
    }
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }
    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      banned: false,
    };
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === signupEmail)) {
      alert("Email already registered!");
      return;
    }
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("yeltubeUser", JSON.stringify(newUser));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    alert("Account created! Welcome, " + signupName + "!");
    window.location.href = "/";
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <div className="auth-form">
            <h2>Welcome Back 👋</h2>
            <p className="auth-subtitle">Login to your YelTube account</p>
            <input
              type="email"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button className="submit-btn" onClick={handleLogin}>
              Login
            </button>
            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>Sign Up</span>
            </p>
          </div>
        )}

        {/* Sign Up Form */}
        {mode === "signup" && (
          <div className="auth-form">
            <h2>Create Account 🎬</h2>
            <p className="auth-subtitle">Join YelTube today</p>
            <input
              type="text"
              placeholder="Full name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email address"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            />
            <button className="submit-btn" onClick={handleSignup}>
              Create Account
            </button>
            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;