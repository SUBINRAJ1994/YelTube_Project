import { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import authService from "../../services/authService";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login", "signup", or "forgot"
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);



  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupDateOfBirth, setSignupDateOfBirth] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

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
    if (!isValidEmail(loginEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await authService.login(loginEmail, loginPassword);
      alert("Login successful!");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.detail || "Invalid email or password");
    }
  };

  const handleSignup = async () => {
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm || !signupDateOfBirth) {
      alert("Please fill all fields, including Date of Birth.");
      return;
    }
    if (!isValidEmail(signupEmail)) {
      alert("Please enter a valid email address.");
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
              <input
                type={showLoginPassword ? "text" : "password"}
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <span className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="forgot-link-container">
              <span className="forgot-link" onClick={() => { setMode("forgot"); setForgotStep("email"); }}>
                Forgot Password?
              </span>
            </div>

            <button className="submit-btn" onClick={handleLogin}>
              Login
            </button>

            <div className="divider"><span>OR</span></div>

            <div className="social-buttons">
              <button className="social-btn google" onClick={() => handleSocialLogin("Google")}>
                <FaGoogle className="social-icon" /> Continue with Google
              </button>
              <button className="social-btn facebook" onClick={() => handleSocialLogin("Facebook")}>
                <FaFacebook className="social-icon" /> Continue with Facebook
              </button>
            </div>

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
              <input
                type={showSignupConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
              <span className="password-toggle" onClick={() => setShowSignupConfirm(!showSignupConfirm)}>
                {showSignupConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="submit-btn" onClick={handleSignup}>
              Create Account
            </button>

            <div className="divider"><span>OR</span></div>

            <div className="social-buttons">
              <button className="social-btn google" onClick={() => handleSocialLogin("Google")}>
                <FaGoogle className="social-icon" /> Sign up with Google
              </button>
              <button className="social-btn facebook" onClick={() => handleSocialLogin("Facebook")}>
                <FaFacebook className="social-icon" /> Sign up with Facebook
              </button>
            </div>

            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
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