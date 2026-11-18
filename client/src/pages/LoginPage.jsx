import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData);
            navigate("/account", { replace: true });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to log in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <header className="login-header">
                <Link to="/" className="login-logo">
                    MeSUS<span>.</span>
                </Link>

                <Link to="/" className="back-link">
                    Back to store
                </Link>
            </header>

            <main className="login-container">

                <section className="login-intro">
                    <span className="eyebrow">WELCOME BACK</span>

                    <h1>
                        Good to
                        <br />
                        have you <em>back.</em>
                    </h1>

                    <p>
                        Your style journey continues here.
                        Sign in to explore your account and
                        discover what's new.
                    </p>

                    <span className="login-decoration">
                        EST. WITH STYLE
                    </span>
                </section>

                <section className="login-form-section">

                    <div className="form-heading">
                        <h2>Sign in</h2>
                        <p>Enter your details to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="email">
                                EMAIL ADDRESS
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="login-error" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={loading}
                        >
                            {loading ? "SIGNING IN..." : "SIGN IN"}
                        </button>

                    </form>

                    <div className="register-prompt">
                        Don't have an account?
                        <Link to="/register"> Create one</Link>
                    </div>

                </section>

            </main>

            <footer className="login-footer">
                <span>© 2026 MeSUS Fashion</span>
                <span>DESIGNED WITH INTENTION.</span>
            </footer>

        </div>
    );
};

export default LoginPage;
