import { useState, useRef } from "react";
import "./Login.css";
<<<<<<< HEAD
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import authService from "../../services/authService";
=======
import { FaEye, FaEyeSlash, FaCamera, FaGoogle, FaFacebook } from "react-icons/fa";
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

const Login = () => {
  const [mode, setMode] = useState("login"); // "login", "signup", or "forgot"
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
<<<<<<< HEAD


=======
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupDateOfBirth, setSignupDateOfBirth] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
<<<<<<< HEAD
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState("email"); // "email", "code", or "reset"
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Email format validator helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill all fields");
      return;
    }
<<<<<<< HEAD
    if (!isValidEmail(loginEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await authService.login(loginEmail, loginPassword);
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
      alert("Login successful!");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid email or password");
    }
  };

<<<<<<< HEAD
  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm || !signupDateOfBirth) {
      alert("Please fill all fields, including Date of Birth.");
      return;
    }
    if (!isValidEmail(signupEmail)) {
      alert("Please enter a valid email address.");
=======
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm || !signupDob) {
      alert("Please fill all fields, including Date of Birth");
      return;
    }
    if (!validateEmail(signupEmail)) {
      alert("Please enter a valid email address");
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
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
<<<<<<< HEAD
    try {
      await authService.register(signupName, signupEmail, signupPassword, signupDateOfBirth);
      alert("Account created successfully! Please log in.");
      setMode("login");
    } catch (err) {
      alert(JSON.stringify(err.response?.data) || "Registration failed");
    }
  };

  // Forgot password flows
  const handleSendResetCode = async () => {
    if (!forgotEmail) {
      alert("Please enter your email");
=======

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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    try {
      const res = await authService.forgotPassword(forgotEmail);
      alert(res.message + (res.token ? `\nToken (for testing): ${res.token}` : ""));
      setForgotStep("code");
    } catch (err) {
      alert(err.response?.data?.error || "Error generating reset token.");
    }
  };

<<<<<<< HEAD
  const handleVerifyCode = () => {
    if (resetCode) {
      setForgotStep("reset");
    } else {
      alert("Please enter the reset token.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await authService.resetPassword(resetCode, newPassword);
      alert("Password reset successfully! You can now log in.");
      setMode("login");
      setForgotStep("email");
      setForgotEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      alert(err.response?.data?.error || "Reset failed");
    }
  };

  const handleSocialLogin = async (provider) => {
    const mockOAuthToken = `mock_${provider.toLowerCase()}_token_${provider.toLowerCase()}user@example.com`;
    try {
      if (provider === "Google") {
        await authService.googleLogin(mockOAuthToken);
      } else {
        await authService.facebookLogin(mockOAuthToken);
      }
      alert(`Successfully signed in with ${provider}!`);
      window.location.href = "/";
    } catch (err) {
      alert(`Error logging in with ${provider}: ${err.response?.data?.error || "OAuth failed"}`);
    }
=======
    // Save avatar specifically
    localStorage.setItem(`profileImage_${emailKey}`, avatarToSave);
    localStorage.setItem(`profileImage_${signupEmail}`, avatarToSave);

    localStorage.setItem("yeltubeUser", JSON.stringify(newUser));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");
    alert("Account created! Welcome, " + signupName + "!");
    window.location.href = "/";
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
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
        {mode !== "forgot" && (
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
        )}

        {/* Login Form */}
        {mode === "login" && (
          <div className="auth-form">
            <h2>Welcome Back 👋</h2>
            <p className="auth-subtitle">Login to your YelTube account</p>
<<<<<<< HEAD
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            
            <div className="input-group password-group">
=======
            <input
              type="email"
              placeholder="Email address"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <div className="password-input-container">
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
<<<<<<< HEAD
              <span className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="forgot-link-container">
              <span className="forgot-link" onClick={() => { setMode("forgot"); setForgotStep("email"); }}>
                Forgot Password?
              </span>
            </div>
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

            <button className="submit-btn" onClick={handleLogin}>
              Login
            </button>

<<<<<<< HEAD
            <div className="divider"><span>OR</span></div>

            <div className="social-buttons">
              <button className="social-btn google" onClick={() => handleSocialLogin("Google")}>
                <FaGoogle className="social-icon" /> Continue with Google
              </button>
              <button className="social-btn facebook" onClick={() => handleSocialLogin("Facebook")}>
                <FaFacebook className="social-icon" /> Continue with Facebook
              </button>
            </div>
=======
            <div className="auth-separator">OR</div>

            <button className="oauth-btn google" onClick={() => handleOAuthLogin("Google")}>
              <FaGoogle /> Continue with Google
            </button>
            <button className="oauth-btn facebook" onClick={() => handleOAuthLogin("Facebook")}>
              <FaFacebook /> Continue with Facebook
            </button>
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

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
            
<<<<<<< HEAD
            <div className="input-group">
              <input
                type="text"
                placeholder="Full name (Username)"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <input
                type="email"
                placeholder="Email address"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            
            <div className="input-group">
              <input
                type="date"
                placeholder="Date of Birth"
                value={signupDateOfBirth}
                onChange={(e) => setSignupDateOfBirth(e.target.value)}
                title="Date of Birth"
              />
            </div>
            
            <div className="input-group password-group">
              <input
                type={showSignupPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
              <span className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)}>
                {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            
            <div className="input-group password-group">
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
              <input
                type={showSignupConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
<<<<<<< HEAD
              <span className="password-toggle" onClick={() => setShowSignupConfirm(!showSignupConfirm)}>
=======
              <span 
                className="password-toggle-icon" 
                onClick={() => setShowSignupConfirm(!showSignupConfirm)}
              >
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
                {showSignupConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="submit-btn" onClick={handleSignup}>
              Create Account
            </button>

<<<<<<< HEAD
            <div className="divider"><span>OR</span></div>

            <div className="social-buttons">
              <button className="social-btn google" onClick={() => handleSocialLogin("Google")}>
                <FaGoogle className="social-icon" /> Sign up with Google
              </button>
              <button className="social-btn facebook" onClick={() => handleSocialLogin("Facebook")}>
                <FaFacebook className="social-icon" /> Sign up with Facebook
              </button>
            </div>
=======
            <div className="auth-separator">OR</div>

            <button className="oauth-btn google" onClick={() => handleOAuthLogin("Google")}>
              <FaGoogle /> Sign up with Google
            </button>
            <button className="oauth-btn facebook" onClick={() => handleOAuthLogin("Facebook")}>
              <FaFacebook /> Sign up with Facebook
            </button>
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9

            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login Here</span>
            </p>
          </div>
        )}

        {/* Forgot Password Flow */}
        {mode === "forgot" && (
          <div className="auth-form">
            <h2>Reset Password 🔑</h2>
            
            {forgotStep === "email" && (
              <>
                <p className="auth-subtitle">Enter your email to receive a password reset link</p>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendResetCode()}
                  />
                </div>
                <button className="submit-btn" onClick={handleSendResetCode}>
                  Send Code
                </button>
              </>
            )}

            {forgotStep === "code" && (
              <>
                <p className="auth-subtitle">Enter the password reset token generated by the server.</p>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Verification token"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                  />
                </div>
                <button className="submit-btn" onClick={handleVerifyCode}>
                  Verify Token
                </button>
              </>
            )}

            {forgotStep === "reset" && (
              <>
                <p className="auth-subtitle">Enter a new secure password for your account</p>
                <div className="input-group password-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span className="password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="input-group password-group">
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                  <span className="password-toggle" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button className="submit-btn" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}

            <p className="switch-text">
              Go back to <span onClick={() => setMode("login")}>Login</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;