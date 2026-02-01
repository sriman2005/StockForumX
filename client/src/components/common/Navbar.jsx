import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { getStocks } from '../../services/api';
import NotificationBell from './NotificationBell';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tickerStocks, setTickerStocks] = useState([]);

    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                const { data } = await getStocks({ limit: 10, sortBy: 'trending' });
                setTickerStocks(data.data || []);
            } catch (error) {
                console.error('Failed to fetch ticker data:', error);
            }
        };
        fetchTickerData();

        const interval = setInterval(fetchTickerData, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
            setIsMenuOpen(false);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="navbar" role="navigation" aria-label="Main navigation">
            {/* Market Ticker */}
            <div className="market-ticker" aria-live="polite">
                <div className="ticker-scroll">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="ticker-content-group">
                            <span className="ticker-status-badge">LIVE MARKET</span>
                            {tickerStocks.length > 0 ? (
                                tickerStocks.map(stock => (
                                    <Link
                                        key={`${i}-${stock.symbol}`}
                                        to={`/stock/${stock.symbol}`}
                                        className="ticker-pair"
                                        aria-label={`${stock.symbol} stock price`}
                                    >
                                        <span className="ticker-symbol">{stock.symbol}</span>
                                        <span className={stock.change >= 0 ? 'ticker-up' : 'ticker-down'}>
                                            ${stock.currentPrice.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <span className="ticker-status-badge">INITIALIZING...</span>
                            )}
                            <span className="ticker-status-badge">
                                <span className="status-pulse"></span>REAL-TIME DATA
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Navigation Container */}
            <div className="navbar-container">
                {/* Brand */}
                <Link to="/" className="navbar-brand" onClick={() => setIsMenuOpen(false)} aria-label="StockForumX Home">
                    <span className="brand-text">Stock<span className="brand-bold">ForumX</span></span>
                </Link>

                {/* Desktop Navigation Links - Hidden on Mobile */}
                <div className="navbar-links navbar-links-desktop">
                    <Link to="/stocks" className="nav-link">
                        Stocks
                    </Link>
                    {isAuthenticated && (
                        <Link to="/feed" className="nav-link">
                            Feed
                        </Link>
                    )}
                    <Link to="/leaderboard" className="nav-link">
                        Leaderboard
                    </Link>
                    {isAuthenticated && (
                        <Link to="/portfolio" className="nav-link portfolio-link">
                            Portfolio
                        </Link>
                    )}
                </div>

                {/* Desktop Search Bar - Hidden on Mobile */}
                <div className="navbar-search-wrapper">
                    <form className="navbar-search" onSubmit={handleSearch} role="search">
                        <FaSearch className="search-icon-nav" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search stocks..."
                            className="search-input-nav"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search for stocks"
                        />
                    </form>
                </div>

                {/* Desktop Auth Section - Hidden on Mobile */}
                <div className="navbar-auth navbar-auth-desktop">
                    {isAuthenticated ? (
                        <div className="user-section">
                            <Link
                                to={`/profile/${user?._id}`}
                                className="user-profile-link"
                                aria-label={`Profile for ${user?.username}`}
                            >
                                <div className="avatar-small">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="user-name">{user?.username}</span>
                                <span className="reputation-badge">
                                    {user?.reputation?.toFixed(0) || 0}
                                </span>
                            </Link>
                            <NotificationBell />
                            <button
                                onClick={logout}
                                className="btn-logout"
                                aria-label="Log out"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-login">
                                Log in
                            </Link>
                            <Link to="/register" className="btn btn-signup">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="navbar-burger"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>

                {/* Mobile Menu - Only Visible on Mobile */}
                <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
                    {/* Mobile Navigation Links */}
                    <div className="navbar-links">
                        <Link to="/stocks" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Stocks
                        </Link>
                        {isAuthenticated && (
                            <Link to="/feed" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                                Feed
                            </Link>
                        )}
                        <Link to="/leaderboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            Leaderboard
                        </Link>
                        {isAuthenticated && (
                            <Link to="/portfolio" className="nav-link portfolio-link" onClick={() => setIsMenuOpen(false)}>
                                Portfolio
                            </Link>
                        )}
                    </div>


                    {/* Mobile Auth Section */}
                    {isAuthenticated ? (
                        <div className="user-section-mobile">
                            <Link
                                to={`/profile/${user?._id}`}
                                className="user-profile-link"
                                onClick={() => setIsMenuOpen(false)}
                                aria-label={`Profile for ${user?.username}`}
                            >
                                <div className="avatar-small">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="user-name">{user?.username}</span>
                                <span className="reputation-badge">
                                    {user?.reputation?.toFixed(0) || 0}
                                </span>
                            </Link>
                            <div className="mobile-notification-wrapper">
                                <NotificationBell />
                            </div>
                            <button
                                onClick={() => { logout(); setIsMenuOpen(false); }}
                                className="btn-logout"
                                aria-label="Log out"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-login" onClick={() => setIsMenuOpen(false)}>
                                Log in
                            </Link>
                            <Link to="/register" className="btn btn-signup" onClick={() => setIsMenuOpen(false)}>
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
