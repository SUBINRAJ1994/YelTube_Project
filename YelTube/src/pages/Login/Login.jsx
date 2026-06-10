import { useState, useRef } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash, FaCamera, FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" or "signup"

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupAvatar, setSignupAvatar] = useState("");
  const [signupDob, setSignupDob] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  const fileInputRef = useRef(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSignupAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill all fields");
      return;
    }
    if (!validateEmail(loginEmail)) {
      alert("Please enter a valid email address");
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
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm || !signupDob) {
      alert("Please fill all fields, including Date of Birth");
      return;
    }
    if (!validateEmail(signupEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    if (signupPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      alert("Passwords do not match");
      return;
    }

    const emailKey = signupEmail.replace(/[@.]/g, "_");
    const avatarToSave = signupAvatar || `https://i.pravatar.cc/150?u=${signupEmail}`;

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      avatar: avatarToSave,
      dob: signupDob,
      banned: false,
    };
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === signupEmail)) {
      alert("Email already registered!");
      return;
    }
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Save avatar specifically
    localStorage.setItem(`profileImage_${emailKey}`, avatarToSave);
    localStorage.setItem(`profileImage_${signupEmail}`, avatarToSave);

    localStorage.setItem("yeltubeUser", JSON.stringify(newUser));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    alert("Account created! Welcome, " + signupName + "!");
    window.location.href = "/";
  };

  const handleForgotPassword = () => {
    const email = window.prompt("Please enter your registered email address to receive a password reset link:");
    if (email === null) return;
    if (!email.trim() || !validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    alert(`Reset password link has been sent to ${email} (Mock Action).`);
  };

  const handleOAuthLogin = (provider) => {
    alert(`${provider} connection is currently running in mockup demo mode.`);
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
            <div className="password-input-container">
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowLoginPassword(!showLoginPassword)}
              >
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            
            <span className="forgot-password-link" onClick={handleForgotPassword}>
              Forgot Password?
            </span>

            <button className="submit-btn" onClick={handleLogin}>
              Login
            </button>

            <div className="auth-separator">OR</div>

            <button className="oauth-btn google" onClick={() => handleOAuthLogin("Google")}>
              <FaGoogle /> Continue with Google
            </button>
            <button className="oauth-btn facebook" onClick={() => handleOAuthLogin("Facebook")}>
              <FaFacebook /> Continue with Facebook
            </button>

            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={() => setMode("signup")}>Create Account</span>
            </p>
          </div>
        )}

        {/* Sign Up Form */}
        {mode === "signup" && (
          <div className="auth-form">
            <h2>Create Account 🎬</h2>
            <p className="auth-subtitle">Join YelTube today</p>
            
            {/* Profile Picture Upload */}
            <div className="avatar-upload-container">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: "none" }} 
                onChange={handleAvatarChange} 
              />
              <div 
                className="avatar-preview-wrap" 
                onClick={() => fileInputRef.current?.click()}
              >
                <img 
                  src={signupAvatar || "https://i.pravatar.cc/150?img=12"} 
                  alt="Avatar Preview" 
                />
                <div className="avatar-upload-overlay">
                  <FaCamera />
                </div>
              </div>
              <span className="avatar-upload-label">Upload Profile Picture</span>
            </div>

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

            <div className="dob-input-label">Date of Birth</div>
            <input
              type="date"
              value={signupDob}
              className="dob-date-picker"
              onChange={(e) => setSignupDob(e.target.value)}
            />
            
            <div className="password-input-container">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="password-input-container">
              <input
                type={showSignupConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowSignupConfirm(!showSignupConfirm)}
              >
                {showSignupConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="submit-btn" onClick={handleSignup}>
              Create Account
            </button>

            <div className="auth-separator">OR</div>

            <button className="oauth-btn google" onClick={() => handleOAuthLogin("Google")}>
              <FaGoogle /> Sign up with Google
            </button>
            <button className="oauth-btn facebook" onClick={() => handleOAuthLogin("Facebook")}>
              <FaFacebook /> Sign up with Facebook
            </button>

            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login Here</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;