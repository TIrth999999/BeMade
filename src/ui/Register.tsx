import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import "../App.css";

export const Register = observer(() => {
    const { uiStore } = useStore();
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
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
                    <h1 className="auth-title">Sign Up</h1>

                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="auth-group">
                            <label className="required">First Name</label>
                            <input type="text" placeholder="" required />
                        </div>

                        <div className="auth-group">
                            <label className="required">Last Name</label>
                            <input type="text" placeholder="" required />
                        </div>

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

                        <div className="auth-group">
                            <label className="required">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input type="password" placeholder="" required />
                                <span className="password-toggle">
                                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="auth-btn">Sign Up</button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Login</Link>
                    </div>
                </div>
            </main>
        </div>
    );
});
