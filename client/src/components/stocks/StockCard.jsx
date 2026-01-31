import { memo } from 'react';
import { Link } from 'react-router-dom';

const StockCard = memo(({ stock }) => {
    return (
        <Link to={`/stock/${stock.symbol}`} className="stock-card">
            <div className="stock-header">
                <div>
                    <h3 className="stock-symbol">{stock.symbol || 'N/A'}</h3>
                    <p className="stock-name">{stock.name || 'Unknown'}</p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <span className="badge badge-info">{stock.sector || 'Other'}</span>
                    {stock.sentimentLabel && stock.sentimentLabel !== 'Neutral' && (
                        <span className={`badge ${stock.sentimentScore > 60 ? 'badge-success' : stock.sentimentScore < 40 ? 'badge-danger' : 'badge-warning'}`}>
                            {stock.sentimentScore > 60 ? '🚀 ' : '📉 '}
                            {stock.sentimentLabel}
                        </span>
                    )}
                </div>
            </div>

            <div className="stock-price">
                <span className="price">${(stock.currentPrice || 0).toFixed(2)}</span>
                <span className={`change ${(stock.change || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {(stock.change || 0) >= 0 ? '+' : ''}{Math.abs(stock.changePercent || 0)}%
                </span>
            </div>

            <div className="stock-stats">
                <div className="stat">
                    <span className="stat-label">Volume</span>
                    <span className="stat-value">{((stock.volume || 0) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Market Cap</span>
                    <span className="stat-value">${((stock.marketCap || 0) / 1000000000).toFixed(1)}B</span>
                </div>
            </div>
        </Link>
    );
});

StockCard.displayName = 'StockCard';

export default StockCard;
