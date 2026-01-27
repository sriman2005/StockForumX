import { useState, useEffect } from 'react';
import { executeTrade, getPortfolio } from '../../services/api';
import toast from 'react-hot-toast';
import { FaCartPlus, FaHandHoldingDollar, FaWallet } from 'react-icons/fa6';
import './TradeBox.css';

const TradeBox = ({ stock }) => {
    const [quantity, setQuantity] = useState(1);
    const [type, setType] = useState('buy');
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [userHolding, setUserHolding] = useState(0);

    useEffect(() => {
        fetchUserData();
    }, [stock._id]);

    const fetchUserData = async () => {
        try {
            const { data } = await getPortfolio();
            setBalance(data.balance);
            const holding = data.holdings.find(h => h.stockId._id === stock._id);
            setUserHolding(holding ? holding.quantity : 0);
        } catch (error) {
            console.error('Failed to fetch user trade data');
        }
    };

    const handleTrade = async (e) => {
        e.preventDefault();
        if (quantity <= 0) return toast.error('Enter valid quantity');

        setLoading(true);
        try {
            const { data } = await executeTrade({
                stockId: stock._id,
                type,
                quantity: Number(quantity)
            });
            toast.success(data.message);
            fetchUserData(); // Refresh balance/holdings
        } catch (error) {
            toast.error(error.response?.data?.message || 'Trade failed');
        } finally {
            setLoading(false);
        }
    };

    const totalCost = (quantity * stock.currentPrice).toFixed(2);

    return (
        <div className="trade-box brute-frame">
            <div className="trade-tabs">
                <button
                    className={`trade-tab buy ${type === 'buy' ? 'active' : ''}`}
                    onClick={() => setType('buy')}
                >
                    BUY
                </button>
                <button
                    className={`trade-tab sell ${type === 'sell' ? 'active' : ''}`}
                    onClick={() => setType('sell')}
                >
                    SELL
                </button>
            </div>

            <form onSubmit={handleTrade} className="trade-form">
                <div className="form-info">
                    <div className="info-item">
                        <span className="label">PRICE</span>
                        <span className="value">${stock.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">YOUR HOLDING</span>
                        <span className="value">{userHolding} SHARES</span>
                    </div>
                </div>

                <div className="input-group">
                    <label>QUANTITY</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                <div className="trade-summary">
                    <div className="summary-row">
                        <span>ESTIMATED TOTAL</span>
                        <span className="total">${totalCost}</span>
                    </div>
                    <div className="summary-row balance">
                        <span><FaWallet /> BALANCE</span>
                        <span>${balance.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`btn-trade ${type} ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? 'EXECUTING...' : (
                        type === 'buy' ?
                            <><FaCartPlus /> INITIATE PURCHASE</> :
                            <><FaHandHoldingDollar /> LIQUIDATE POSITION</>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TradeBox;
