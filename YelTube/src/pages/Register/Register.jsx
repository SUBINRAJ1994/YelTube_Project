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
    };
    reader.readAsDataURL(file);
  };

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

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

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
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account 🎬</h2>
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
            <div className="avatar-upload-overlay">
              <FaCamera />
            </div>
          </div>
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
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-group password-group">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
          />
          <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} onKeyDown={(e) => e.key === "Enter" && handleRegister()}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

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
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;