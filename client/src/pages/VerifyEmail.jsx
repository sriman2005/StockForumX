import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import './Auth.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyEmail(email, otp);
            toast.success('Email verified! You are now logged in.');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
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
                        <h1 className="visual-title">Verify <br /><span>Identity.</span></h1>
                        <p className="visual-tagline">Security is our top priority.</p>
                    </div>

                    <div className="ticker-wrap">
                        <div className="ticker-content">
                            <span className="ticker-item">ENCRYPTED PROTOCOL</span>
                            <span className="ticker-item">MULTI-FACTOR AUTH</span>
                            <span className="ticker-item">SECURE GATEWAY</span>
                            <span className="ticker-item">VERIFIED STATUS pending</span>
                            <span className="ticker-item">ENCRYPTED PROTOCOL</span>
                        </div>
                    </div>
                </div>

                {/* Form Side */}
                <div className="auth-form-side">
                    <div className="auth-container">
                        <div className="auth-card brute-frame">
                            <div className="auth-header">
                                <h1 className="auth-title">Verify Email</h1>
                                <p className="auth-subtitle">Enter the OTP sent to your email.</p>
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
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="otp">OTP Code</label>
                                    <input
                                        type="text"
                                        id="otp"
                                        className="form-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </button>
                            </form>
                            <div className="auth-footer">
                                <Link to="/login">Back to Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
