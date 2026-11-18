import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

const RegisterPage = () => {
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
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
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setSuccess(true);

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <header className="register-header">
                <Link to="/" className="register-logo">
                    MeSUS<span>.</span>
                </Link>

                <Link to="/" className="back-link">
                    Back to store
                </Link>
            </header>

            <main className="register-container">

                <section className="register-intro">
                    <span className="eyebrow">BECOME A MEMBER</span>

                    <h1>
                        A new
                        <br />
                        chapter of <em>style.</em>
                    </h1>

                    <p>
                        Create your account and make your
                        shopping experience a little more personal.
                        Your next favourite piece is waiting.
                    </p>

                    <span className="register-decoration">
                        FIND YOUR OWN STYLE
                    </span>
                </section>

                <section className="register-form-section">

                    <div className="form-heading">
                        <h2>Create account</h2>
                        <p>Fill in your details to get started.</p>
                    </div>

                    {success ? (
                        <div className="register-success" role="status">
                            <h3>You're all set.</h3>

                            <p>
                                Your account has been created successfully.
                                You can now sign in using your email and password.
                            </p>

                            <Link to="/login" className="register-submit">
                                CONTINUE TO SIGN IN
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">
                                    FULL NAME
                                </label>

                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    minLength={2}
                                    maxLength={100}
                                    required
                                />
                            </div>

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
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={72}
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

                                <span className="field-hint">
                                    Use at least 8 characters.
                                </span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    CONFIRM PASSWORD
                                </label>

                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Enter your password again"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    minLength={8}
                                    maxLength={72}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="register-error" role="alert">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >
                                {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                            </button>

                        </form>
                    )}

                    {!success && (
                        <div className="login-prompt">
                            Already have an account?
                            <Link to="/login"> Sign in</Link>
                        </div>
                    )}

                </section>

            </main>

            <footer className="register-footer">
                <span>© 2026 MeSUS Fashion</span>
                <span>DESIGNED WITH INTENTION.</span>
            </footer>

        </div>
    );
};

export default RegisterPage;
