import './Register.css';
import { useState } from 'react';



const Register = () => {
    const [name, setName] = useState ("");
    const [email, setEmail] = useState ("");
    const [password, setPassword] = useState ("");
    const [confirmPassword, setConfirmPassword] = useState ("");

    const handleRegister = () => {
        if (!name || !email || !password || !confirmPassword) 
        {
            alert ("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) 
        {
            alert ("Passwords do not match");
            return;
        }
        // alert ("Registration successful");
        const userData = {
            name,
            email,
            password
        };
        localStorage.setItem("yeltubeUser", JSON.stringify(userData));
        alert ("Registration successful");
        };

    return (
        <div className="register-page">
            <div className='register-container'>
                <h2>Create Account</h2>
                <input 
                    type="text"
                    placeholder='Username'
                    value={name}
                    onChange={(e) => setName (e.target.value)} />
                <input 
                    type="email"
                    placeholder='Enter Your Email id'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <input 
                    type="password" 
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword (e.target.value)}/>
                <input 
                type="password" 
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword (e.target.value)}/>
                <button onClick={handleRegister}>Register</button>

            </div>

        </div>
    )
};


export default Register;