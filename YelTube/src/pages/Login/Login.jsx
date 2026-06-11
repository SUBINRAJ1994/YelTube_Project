import { useState } from "react";
import "./Login.css";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login", "signup", or "forgot"
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStep, setForgotStep] = useState("email"); // "email", "code", or "reset"
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Email format validator helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert("Please fill all fields");
      return;
    }
    if (!isValidEmail(loginEmail)) {
      alert("Please enter a valid email address.");
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

    const newUser = {
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      banned: false,
      warnings: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupName)}&background=random&color=fff`
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

  // Forgot password flows
  const handleSendResetCode = () => {
    if (!forgotEmail) {
      alert("Please enter your email");
      return;
    }
    if (!isValidEmail(forgotEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((u) => u.email === forgotEmail);
    const legacyUser = JSON.parse(localStorage.getItem("yeltubeUser"));
    const legacyExists = legacyUser && legacyUser.email === forgotEmail;

    if (userExists || legacyExists) {
      alert("Demo Mode: Reset code sent! Enter '123456' to proceed.");
      setForgotStep("code");
    } else {
      alert("This email is not registered with YelTube.");
    }
  };

  const handleVerifyCode = () => {
    if (resetCode === "123456") {
      setForgotStep("reset");
    } else {
      alert("Invalid verification code. Enter '123456' for verification.");
    }
  };

  const handleResetPassword = () => {
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

    // Update in users
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) => {
      if (u.email === forgotEmail) {
        return { ...u, password: newPassword };
      }
      return u;
    });
    localStorage.setItem("users", JSON.stringify(users));

    // Update legacy yeltubeUser
    const legacyUser = JSON.parse(localStorage.getItem("yeltubeUser"));
    if (legacyUser && legacyUser.email === forgotEmail) {
      legacyUser.password = newPassword;
      localStorage.setItem("yeltubeUser", JSON.stringify(legacyUser));
    }

    alert("Password reset successfully! You can now log in.");
    setMode("login");
    setForgotStep("email");
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  // Mock social logins
  const handleSocialLogin = (provider) => {
    const mockUser = {
      name: `${provider} User`,
      email: `${provider.toLowerCase()}user@example.com`,
      banned: false,
      warnings: 0,
      avatar: provider === "Google" 
        ? "https://lh3.googleusercontent.com/a/default-user=s40-c" 
        : "https://graph.facebook.com/v10.0/100000000000000/picture?type=square"
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(u => u.email === mockUser.email)) {
      users.push(mockUser);
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    localStorage.setItem("isLoggedIn", "true");
    alert(`Successfully signed in with ${provider}!`);
    window.location.href = "/";
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
                placeholder="Full name"
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
            
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm password"
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
              />
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
                <p className="auth-subtitle">Enter your email to receive a password reset code</p>
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
                <p className="auth-subtitle">We sent a verification code to {forgotEmail}.</p>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Verification code (Enter 123456)"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                  />
                </div>
                <button className="submit-btn" onClick={handleVerifyCode}>
                  Verify Code
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
                <div className="input-group">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
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