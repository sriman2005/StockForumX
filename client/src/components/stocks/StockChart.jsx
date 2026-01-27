import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import './StockChart.css';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="tooltip-date">{label}</p>
                <p className="tooltip-price">${payload[0].value.toFixed(2)}</p>
            </div>
        );
    }
    return null;
};

const StockChart = ({ data, color = "#3b82f6" }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="stock-chart-container">
            <div className="chart-header">
                <h3 className="chart-title">Price History</h3>
                <span className="chart-period">Last 30 Days</span>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0 0" vertical={false} />
                        <XAxis
                            dataKey="date"
                            hide={true}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            orientation="right"
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="stepAfter"
                            dataKey="price"
                            stroke={color}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StockChart;
