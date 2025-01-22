import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import 'font-awesome/css/font-awesome.min.css';
import "./css/login.css";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate  } from "react-router-dom";
import { get, getDatabase, ref, set } from "firebase/database";

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

interface productsType {
    name: string;
    price: string;
    quantity: string;
}

interface ToupiItem {
    igname: string;
    number: string;
    address: string;
    price: string;
    orderCode?: string;
    products: productsType[];
    status?: string;
    date?: string;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true); 

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
    let [searchTerm, setSearchTerm] = useState<string>('');
    const [foundOrders, setFoundOrders] = useState<ToupiItem[] | null>(null);

    const findOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        const db = getDatabase(app);
        const dbRef = ref(db, "order");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const data: ToupiItem[] = Object.values(snapshot.val());
            const matchedOrders = data.filter((item) =>
                Object.values(item).some((value) =>
                    typeof value === "string" && searchTerm.toLowerCase().includes(value.toLowerCase())
                )
            );
            setFoundOrders(matchedOrders);
        } else {
            alert("No orders found");
            setFoundOrders([]);
        }
    };

    return (
        <div className="container" id="container">
            <div className={`form-container ${isLogin ? "sign-in" : "sign-up"}`}>
                <form onSubmit={isLogin ? login : findOrder}>
                    <h1 style={{color:'black'}}>{isLogin ? "Đăng nhập" : "Find your Order"}</h1>
                    {!isLogin && <input type="text" placeholder="Code Order" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />}
                    {isLogin && (
                        <>
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
                        </>
                    )}
                    {isLogin && <a href="#">Forget your password?</a>}
                    <button type="submit">{isLogin ? "Sign In" : "Find Order"}</button>
                    <div className="order-results">
                        {!isLogin && foundOrders && (
                            <div className="order-results-content">
                                <h1>{foundOrders.length > 0 ? "" : "No Orders Found"}</h1>
                                {foundOrders.length > 0 && (
                                    <div className="order-list">
                                        {foundOrders.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <p><strong>ig:</strong> {item.igname}</p>
                                                <p><strong>phone:</strong> {item.number}</p>
                                                <p><strong>address:</strong> {item.address}</p>
                                                <p><strong>price:</strong> {item.price}</p>
                                                <p><strong>products:</strong> <br />
                                                {item.products.map((product, idx) => (
                                                    <React.Fragment key={idx}>
                                                        <span className="product-item">
                                                            {product.name} - {product.quantity}
                                                        </span>
                                                        <br />
                                                    </React.Fragment>
                                                ))}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
                        <h1>Chào bạn</h1>
                        <p>Bạn muốn tra thông tin đơn hàng của Bạn hả??</p>
                        <button className="hidden" id="register" onClick={() => setIsLogin(false)}>FIND ORDER</button>
                    </div>
                </div>
                
            </div>

        </div>
    );
};

export default Login;
