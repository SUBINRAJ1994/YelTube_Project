import { useState } from "react";
import "./Login.css";


const Login =()=> {

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	
	const handleLogin = () => {
		if (!email || !password){
			alert ("Please fill all fields");
		return;
	}
	const storedData = localStorage.getItem("yeltubeUser");
	const savedUser = storedData ? JSON.parse(storedData) : null;

	if (
		savedUser &&
		savedUser.email === email &&
		savedUser.password === password
	){
		localStorage.setItem("currentUser", JSON.stringify(savedUser));
		localStorage.setItem("isLoggedIn", "true");
		alert ("Login successful");
		window.location.href = "/profile";
	}
	else{
		alert ("Invalid email or password");
	}
};
	return (
		<div className="login-page">
			<div className="login-container">
				<h2>Login</h2>
				<input type="email"
					placeholder="Email"
					value={email}
					onChange={(e)=> setEmail (e.target.value)} />
				<input 
					type="password"
					className="form-control"
					placeholder="Enter Password"
					value={password}
					onChange={(e)=> setPassword(e.target.value) } />
				<button 
					onClick={handleLogin} 
					type="button">
					Login
				</button>
			</div>
		</div>
	)
}
export default Login;