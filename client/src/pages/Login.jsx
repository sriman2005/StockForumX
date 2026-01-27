import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaChartLine, FaEye, FaEyeSlash, FaGoogle, FaGithub } from 'react-icons/fa';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';

            if (msg.includes('verify your email')) {
                toast.error('Account not verified. Redirecting...');
                setTimeout(() => navigate(`/verify-email?email=${encodeURIComponent(email)}`), 1500);
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page brute-dot">
            <div className="auth-split">
                {/* Visual Side */}
                <div className="auth-visual brute-grid">
                    <div className="visual-content">
                        <h1 className="visual-title">Trade <br /><span>Smarter.</span></h1>
                        <p className="visual-tagline">Real-time insights for serious investors.</p>
                    </div>

                    <div className="ticker-wrap">
                        <div className="ticker-content">
                            <span className="ticker-item">$AAPL +2.4%</span>
                            <span className="ticker-item">$TSLA -1.8%</span>
                            <span className="ticker-item">$BTC +5.2%</span>
                            <span className="ticker-item">MARKET OPEN</span>
                            <span className="ticker-item">$GOOGL +0.9%</span>
                            <span className="ticker-item">$AMZN -0.4%</span>
                            <span className="ticker-item">CONSENSUS REACHED</span>
                            <span className="ticker-item">$MSFT +1.2%</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <div className="auth-container">
                        <div className="auth-card brute-frame">
                            <div className="auth-header">
                                <h1 className="auth-title">Sign In</h1>
                                <p className="auth-subtitle">Welcome back! Please enter your details.</p>
                            </div>

                            <div className="social-buttons">
                                <button type="button" className="social-btn google">
                                    <FaGoogle /> Google
                                </button>
                                <button type="button" className="social-btn github">
                                    <FaGithub /> GitHub
                                </button>
                            </div>

                            <div className="auth-divider">
                                <span>OR</span>
                            </div>

                            <form onSubmit={handleSubmit} className="auth-form">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@company.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="password">Password</label>
                                    <div className="input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            className="form-input"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-extras">
                                    <Link to="/forgot-password" university-auth-link="true" className="forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>

                                <Link to="/login-otp" className="otp-login-link">
                                    Login with OTP (Passwordless)
                                </Link>

                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'Authenticating...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="auth-footer">
                                Don't have an account? <Link to="/register">Create one</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
