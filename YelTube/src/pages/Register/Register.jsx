<<<<<<< HEAD
import "./Register.css";
import { useState, useRef } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaCamera, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import videoService from "../../services/videoService";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5000000) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
    };
    reader.readAsDataURL(file);
  };

<<<<<<< HEAD
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      alert("Please fill all fields, including Date of Birth.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

=======
  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword || !dob) {
      alert("Please fill all fields, including Date of Birth");
      return;
    }
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
<<<<<<< HEAD

=======
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

<<<<<<< HEAD
    try {
      // 1. Create account
      await authService.register(name, email, password, dateOfBirth);
      
      // 2. Log in automatically
      await authService.login(email, password);

      // 3. Upload avatar if selected
      if (avatar) {
        const blob = await (await fetch(avatar)).blob();
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        const formData = new FormData();
        formData.append("profile_pic", file);
        await videoService.updateStudioProfile(formData);
        await authService.getCurrentUser();
      }

      alert("Registration successful! Welcome to YelTube!");
      navigate("/");
    } catch (err) {
      alert(JSON.stringify(err.response?.data) || "Registration failed");
    }
  };

  const handleSocialRegister = async (provider) => {
    const mockOAuthToken = `mock_${provider.toLowerCase()}_token_${provider.toLowerCase()}creator@example.com`;
    try {
      if (provider === "Google") {
        await authService.googleLogin(mockOAuthToken);
      } else {
        await authService.facebookLogin(mockOAuthToken);
      }
      alert(`Successfully signed up with ${provider}!`);
      navigate("/");
    } catch (err) {
      alert(`Error signing up with ${provider}: ${err.response?.data?.error || "OAuth failed"}`);
    }
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account 🎬</h2>
<<<<<<< HEAD
        <p className="register-subtitle">Join the YelTube community today</p>

        {/* Profile Picture Upload Section */}
        <div className="avatar-upload-section">
          <div className="avatar-preview-container" onClick={triggerFileInput}>
            {avatar ? (
              <img src={avatar} alt="Avatar Preview" className="avatar-preview-img" />
            ) : (
              <div className="avatar-placeholder-init">
                <FaCamera className="camera-upload-icon" />
                <span>Upload</span>
              </div>
            )}
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
            <div className="avatar-upload-overlay">
              <FaCamera />
            </div>
          </div>
<<<<<<< HEAD
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <span className="avatar-upload-label">Choose Profile Picture</span>
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        <div className="input-group">
          <input
            type="date"
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            title="Date of Birth"
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

<<<<<<< HEAD
        <div className="input-group password-group">
=======
        <div className="password-input-container">
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
<<<<<<< HEAD
          <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} onKeyDown={(e) => e.key === "Enter" && handleRegister()}>
=======
          <span
            className="password-toggle-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

<<<<<<< HEAD
        <button className="register-btn" onClick={handleRegister} onKeyDown={(e) => e.key === "Enter" && handleRegister()}>
          Register
        </button>

        <div className="divider"><span>OR</span></div>

        <div className="social-buttons">
          <button className="social-btn google" onClick={() => handleSocialRegister("Google")}>
            <FaGoogle className="social-icon" /> Sign up with Google
          </button>
          <button className="social-btn facebook" onClick={() => handleSocialRegister("Facebook")}>
            <FaFacebook className="social-icon" /> Sign up with Facebook
          </button>
        </div>

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Login <FaSignInAlt className="inline-login-icon" />
=======
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
>>>>>>> b686d1b5e1f53f1188c71b00de8a8d59206730d9
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;