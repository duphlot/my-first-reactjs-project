import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import 'font-awesome/css/font-awesome.min.css';
import "./css/login.css";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate  } from "react-router-dom";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register

    useEffect(() => {
        const container = document.getElementById('container');
        const registerBtn = document.getElementById('register');
        const loginBtn = document.getElementById('login');

        if (registerBtn && loginBtn && container) {
            registerBtn.addEventListener('click', () => {
                container.classList.add("active");
            });

            loginBtn.addEventListener('click', () => {
                container.classList.remove("active");
            });
        }

        // Cleanup event listeners on component unmount
        return () => {
            if (registerBtn && loginBtn) {
                registerBtn.removeEventListener('click', () => {
                    container?.classList.add("active");
                });

                loginBtn.removeEventListener('click', () => {
                    container?.classList.remove("active");
                });
            }
        };
    }, []);

    // Register Function
    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User Registered:", userCredential.user);
            alert("Registration Successful!");
        } catch (error: any) {
            console.error(error.message);
            alert(`Registration Error: ${error.message}`);
        }
    };
    const navigate = useNavigate();
    // Login Function
    const login = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged In:", userCredential.user);
            navigate("/admin");
        } catch (error: any) {
            console.error(error.message);
            alert(`Login Error: ${error.message}`);
        }
    };

    return (
        <div className="container" id="container">
            <div className={`form-container ${isLogin ? "sign-in" : "sign-up"}`}>
                <form onSubmit={isLogin ? login : register}>
                    <h1>{isLogin ? "Sign In" : "Create Account"}</h1>
                    <div className="social-media">
                        <a href="#" className="icon"><i className="fa-brands fa-google"></i></a>
                        <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                        <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                        {!isLogin && <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>}
                    </div>
                    <span>{isLogin ? "or use your email password" : "or use your email for registration"}</span>
                    {!isLogin && <input type="text" placeholder="Name" />}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {isLogin && <a href="#">Forget your password?</a>}
                    <button type="submit">{isLogin ? "Sign In" : "Sign Up"}</button>
                </form>
            </div>
            <div className="toggle-container">
                <div className="toggle">
                    <div className="toggle-panel toggle-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="hidden" id="login" onClick={() => setIsLogin(true)}>Sign In</button>
                    </div>
                    <div className="toggle-panel toggle-right">
                        <h1>Hello, Friend!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button className="hidden" id="register" onClick={() => setIsLogin(false)}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
