import { useState, useRef } from "react";
import "./Register.css";
import { FaEye, FaEyeSlash, FaCamera, FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dob, setDob] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword || !dob) {
      alert("Please fill all fields, including Date of Birth");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const emailKey = email.replace(/[@.]/g, "_");
    const avatarToSave = avatar || `https://i.pravatar.cc/150?u=${email}`;

    const userData = {
      name,
      email,
      password,
      avatar: avatarToSave,
      dob,
      banned: false,
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    // Save avatar specifically
    localStorage.setItem(`profileImage_${emailKey}`, avatarToSave);
    localStorage.setItem(`profileImage_${email}`, avatarToSave);

    localStorage.setItem("yeltubeUser", JSON.stringify(userData));
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    alert("Registration successful! Welcome, " + name);
    window.location.href = "/";
  };

  const handleOAuthSignup = (provider) => {
    alert(`${provider} connection is currently running in mockup demo mode.`);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account 🎬</h2>
        <p className="register-subtitle">Join YelTube today</p>

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
              src={avatar || "https://i.pravatar.cc/150?img=12"}
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
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Enter Your Email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="dob-input-label">Date of Birth</div>
        <input
          type="date"
          value={dob}
          className="dob-date-picker"
          onChange={(e) => setDob(e.target.value)}
        />

        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="password-input-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button onClick={handleRegister} className="register-submit-btn">
          Register
        </button>

        <div className="auth-separator">OR</div>

        <button className="oauth-btn google" onClick={() => handleOAuthSignup("Google")}>
          <FaGoogle /> Sign up with Google
        </button>
        <button className="oauth-btn facebook" onClick={() => handleOAuthSignup("Facebook")}>
          <FaFacebook /> Sign up with Facebook
        </button>

        <p className="switch-text-register">
          Already have an account?{" "}
          <Link to="/login">
            <span>Login Here</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;