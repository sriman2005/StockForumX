import { useState, useEffect } from 'react';
import { getPortfolio, getTradeHistory, getWatchlist, getDiversification, getCurrentUser } from '../services/api';
import { Link } from 'react-router-dom';
import { FaWallet, FaChartPie, FaClockRotateLeft, FaArrowTrendUp, FaArrowTrendDown, FaStar, FaShieldHalved } from 'react-icons/fa6';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import './Portfolio.css';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [history, setHistory] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [diversification, setDiversification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('holdings');

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            const userRes = await getCurrentUser();
            const userId = userRes.data._id;

            const [portfolioRes, historyRes, watchlistRes, divRes] = await Promise.all([
                getPortfolio(),
                getTradeHistory(),
                getWatchlist(),
                getDiversification(userId)
            ]);
            setPortfolio(portfolioRes.data);
            setHistory(historyRes.data);
            setWatchlist(watchlistRes.data);
            setDiversification(divRes.data || []);
        } catch (error) {
            console.error('Failed to load portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="portfolio-page fade-in">
            <div className="container">
                {/* Portfolio Header / Net Worth */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '20px', marginBottom: '20px' }}>
                    <div className="portfolio-header-card brute-frame">
                        <div className="net-worth-section">
                            <span className="label">ESTIMATED NET WORTH</span>
                            <h1 className="value">${portfolio?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                            <div className="header-stats">
                                <div className="header-stat">
                                    <span className="stat-label">CASH BALANCE</span>
                                    <span className="stat-value">${portfolio?.balance.toLocaleString()}</span>
                                </div>
                                <div className="header-stat">
                                    <span className="stat-label">HOLDINGS VALUE</span>
                                    <span className="stat-value">${portfolio?.holdingsValue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diversification Card (Powered by Analytics Service) */}
                    <div className="diversification-card brute-frame" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <FaShieldHalved style={{ color: 'var(--accent-info)' }} />
                            <span style={{ fontWeight: 'bold', letterSpacing: '1px' }}>DIVERSIFICATION</span>
                        </div>
                        <div className="diversification-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {diversification.length > 0 ? (
                                diversification.sort((a, b) => b.percentage - a.percentage).map(item => (
                                    <div key={item.sector} className="div-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                                            <span>{item.sector}</span>
                                            <span style={{ fontWeight: 'bold' }}>{item.percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="progress-bg" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    height: '100%',
                                                    width: `${item.percentage}%`,
                                                    background: 'var(--accent-info)',
                                                    boxShadow: '0 0 10px var(--accent-info)'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>No data available. Buy stocks to see diversification.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="portfolio-tabs brute-frame">
                    <button
                        className={`tab-btn ${activeTab === 'holdings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('holdings')}
                    >
                        <FaChartPie /> CURRENT HOLDINGS
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <FaClockRotateLeft /> TRADE HISTORY
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('watchlist')}
                    >
                        <FaStar /> WATCHLIST
                    </button>
                </div>

                {/* Tab Content */}
                <div className="portfolio-content">
                    {activeTab === 'holdings' ? (
                        <div className="holdings-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                            {portfolio?.holdings.length === 0 ? (
                                <EmptyState
                                    title="EMPTY PORTFOLIO"
                                    message="You don't own any stocks yet. Go to the stock market to make your first trade!"
                                    action="Browse Stocks"
                                    onAction={() => window.location.href = '/stocks'}
                                />
                            ) : (
                                portfolio?.holdings.map(holding => (
                                    <Link to={`/stock/${holding.stockId.symbol}`} key={holding._id} className="holding-card brute-frame">
                                        <div className="holding-header">
                                            <div className="stock-info">
                                                <span className="symbol">{holding.stockId.symbol}</span>
                                                <span className="name">{holding.stockId.name}</span>
                                            </div>
                                            <div className={`price-info ${holding.stockId.change >= 0 ? 'up' : 'down'}`}>
                                                ${holding.stockId.currentPrice.toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="holding-stats">
                                            <div className="h-stat">
                                                <span className="l">SHARES</span>
                                                <span className="v">{holding.quantity}</span>
                                            </div>
                                            <div className="h-stat">
                                                <span className="l">AVG PRICE</span>
                                                <span className="v">${holding.averagePrice.toFixed(2)}</span>
                                            </div>
                                            <div className="h-stat">
                                                <span className="l">MARKET VALUE</span>
                                                <span className="v">${holding.currentValue.toFixed(2)}</span>
                                            </div>
                                            <div className={`h-stat ${holding.profitLoss >= 0 ? 'profit' : 'loss'}`}>
                                                <span className="l">P/L</span>
                                                <span className="v">
                                                    {holding.profitLoss >= 0 ? '+' : ''}${Math.abs(holding.profitLoss).toFixed(2)}
                                                    <span className="p">({holding.profitLossPercent.toFixed(2)}%)</span>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    ) : activeTab === 'history' ? (
                        <div className="history-list brute-frame">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>TYPE</th>
                                        <th>SYMBOL</th>
                                        <th>QUANTITY</th>
                                        <th>PRICE</th>
                                        <th>TOTAL</th>
                                        <th>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map(tx => (
                                        <tr key={tx._id}>
                                            <td className={`tx-type ${tx.type}`}>
                                                {tx.type.toUpperCase()}
                                            </td>
                                            <td className="tx-symbol">{tx.stockId.symbol}</td>
                                            <td>{tx.quantity}</td>
                                            <td>${tx.price.toFixed(2)}</td>
                                            <td>${tx.totalAmount.toFixed(2)}</td>
                                            <td className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {history.length === 0 && <p className="empty-msg">No transactions recorded.</p>}
                        </div>
                    ) : (
                        <div className="watchlist-grid">
                            {watchlist.length === 0 ? (
                                <EmptyState
                                    title="EMPTY WATCHLIST"
                                    message="You haven't added any stocks to your watchlist yet."
                                    action="Browse Stocks"
                                    onAction={() => window.location.href = '/stocks'}
                                />
                            ) : (
                                watchlist.map(stock => (
                                    <Link to={`/stock/${stock.symbol}`} key={stock._id} className="stock-card brute-frame">
                                        <div className="stock-card-header">
                                            <span className="symbol">{stock.symbol}</span>
                                            <span className={`price-tag ${stock.change >= 0 ? 'up' : 'down'}`}>
                                                ${stock.currentPrice.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="stock-card-body">
                                            <span className="name">{stock.name}</span>
                                            <span className={`change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
