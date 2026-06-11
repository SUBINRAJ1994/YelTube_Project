import "./Register.css";
import { useState, useRef } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaCamera, FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2000000) {
      alert("Image size should be less than 2MB.");
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

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    
    // Email regex validation
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

    const finalAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;

    const newUser = {
      name,
      email,
      password,
      avatar: finalAvatar,
      banned: false,
      warnings: 0,
      createdAt: new Date().toISOString()
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("yeltubeUser", JSON.stringify(newUser));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    localStorage.setItem("isLoggedIn", "true");

    // Also sync the header/profile image cache key
    const emailKey = email.replace(/[@.]/g, "_");
    localStorage.setItem(`profileImage_${emailKey}`, finalAvatar);

    alert("Registration successful! Welcome to YelTube!");
    navigate("/");
  };

  const handleSocialRegister = (provider) => {
    const mockUser = {
      name: `${provider} Creator`,
      email: `${provider.toLowerCase()}creator@example.com`,
      avatar: provider === "Google" 
        ? "https://lh3.googleusercontent.com/a/default-user=s40-c" 
        : "https://graph.facebook.com/v10.0/100000000000000/picture?type=square",
      banned: false,
      warnings: 0,
      createdAt: new Date().toISOString()
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (!users.some(u => u.email === mockUser.email)) {
      users.push(mockUser);
      localStorage.setItem("users", JSON.stringify(users));
    }

    localStorage.setItem("currentUser", JSON.stringify(mockUser));
    localStorage.setItem("isLoggedIn", "true");
    
    const emailKey = mockUser.email.replace(/[@.]/g, "_");
    localStorage.setItem(`profileImage_${emailKey}`, mockUser.avatar);

    alert(`Successfully signed up with ${provider}!`);
    navigate("/");
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
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="register-btn" onClick={handleRegister}>
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