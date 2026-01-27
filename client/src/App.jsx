import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import StockList from './pages/StockList';
import StockDetail from './pages/StockDetail';
import QuestionDetail from './pages/QuestionDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import VerifyEmail from './pages/VerifyEmail';
import LoginOTP from './pages/LoginOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/error/NotFound';
import Portfolio from './pages/Portfolio';

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <div className="app">
                        <Navbar />
                        <main>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/stocks" element={<StockList />} />
                                <Route path="/stock/:symbol" element={<StockDetail />} />
                                <Route path="/question/:id" element={<QuestionDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                <Route path="/verify-email" element={<VerifyEmail />} />
                                <Route path="/login-otp" element={<LoginOTP />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/portfolio" element={<Portfolio />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                className: 'brute-toast',
                                style: {
                                    borderRadius: '0',
                                    border: '3px solid #000',
                                    background: '#fff',
                                    color: '#000',
                                    padding: '16px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    fontSize: '0.9rem',
                                    boxShadow: '6px 6px 0px #000',
                                },
                                success: {
                                    style: {
                                        background: 'var(--color-success)',
                                    },
                                },
                                error: {
                                    style: {
                                        background: 'var(--color-danger)',
                                        color: '#fff',
                                    },
                                },
                                loading: {
                                    style: {
                                        background: 'var(--color-info)',
                                    },
                                },
                            }}
                        />
                    </div>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
