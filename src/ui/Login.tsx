import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import "../App.css";

export const Login = observer(() => {
    const { uiStore } = useStore();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        uiStore.setLoggedIn(true);
        navigate("/");
    };

    return (
        <div className="auth-page">
            <header className="auth-header">
                <img
                    src="assets/header_logo.svg"
                    alt="BeMade"
                    className="navbar-logo"
                    onClick={() => navigate("/")}
                    style={{ cursor: 'pointer' }}
                />
            </header>

            <main className="auth-container">
                <div className="auth-card">
                    <div className="auth-back">
                        <Link to="/">Back</Link>
                    </div>

                    <h1 className="auth-title">Login</h1>

                    <form className="auth-form" onSubmit={handleLogin}>
                        <div className="auth-group">
                            <label className="required">Email</label>
                            <input type="email" placeholder="" required />
                        </div>

                        <div className="auth-group">
                            <label className="required">Password</label>
                            <div className="password-input-wrapper">
                                <input type="password" placeholder="" required />
                                <span className="password-toggle">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn">Login</button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign Up</Link>
                    </div>
                </div>
            </main>
        </div>
    );
});
