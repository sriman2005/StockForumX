import { useRef, useEffect, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import Loader from '../common/Loader';

const CandlestickChart = ({ data, volumeData, height = 400 }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!data || data.length === 0) return;
        setLoading(false);

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: 'black',
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            grid: {
                vertLines: { color: '#e2e8f0' },
                horzLines: { color: '#e2e8f0' },
            },
            rightPriceScale: {
                borderColor: '#e2e8f0',
            },
            timeScale: {
                borderColor: '#e2e8f0',
            },
        });

        // Candlestick Series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',       // Success color (Green)
            downColor: '#ef4444',     // Danger color (Red)
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        candlestickSeries.setData(data);

        // Volume Series
        if (volumeData && volumeData.length > 0) {
            const volumeSeries = chart.addHistogramSeries({
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // Set scale to overlay
            });

            // Set volume scale margins to position it at bottom
            volumeSeries.priceScale().applyOptions({
                scaleMargins: {
                    top: 0.8, // Highest volume bar takes up bottom 20%
                    bottom: 0,
                },
            });

            // Map volume data to color based on price change if not already provided
            const coloredVolumeData = volumeData.map((item, index) => {
                const prev = index > 0 ? data[index - 1] : data[index];
                const current = data[index];
                const isGrowth = current.close >= current.open;
                return {
                    time: item.time,
                    value: item.value,
                    color: isGrowth ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                };
            });

            volumeSeries.setData(coloredVolumeData);
        }

        chartRef.current = chart;

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, volumeData, height]);

    return (
        <div className="chart-wrapper brute-frame" style={{ position: 'relative', background: 'white', padding: '10px' }}>
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10, background: 'rgba(255,255,255,0.8)'
                }}>
                    <Loader />
                </div>
            )}
            <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px` }} />
        </div>
    );
};

export default CandlestickChart;
