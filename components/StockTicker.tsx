"use client";

import { useEffect, useState, useRef } from "react";

interface StockItem {
    ticker: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isPositive: boolean;
    currency: string;
}

export default function StockTicker() {
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [lastSync, setLastSync] = useState("SYNCING...");
    const [error, setError] = useState(false);
    const marqueeRef = useRef<HTMLDivElement>(null);

    const fetchStocks = async () => {
        try {
            const res = await fetch('/api/stocks');
            const data = await res.json();

            if (data.status === "ok") {
                setStocks(data.items);
                setError(false);
                setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            } else {
                setError(true);
            }
        } catch (e) {
            console.error("Stock fetch error:", e);
            setError(true);
        }
    };

    useEffect(() => {
        fetchStocks();
        const refreshTimer = setInterval(fetchStocks, 300000); // 5 mins
        return () => clearInterval(refreshTimer);
    }, []);

    if (error) {
        return (
            <div className="tech-border flex flex-col h-full min-h-0 overflow-hidden bg-black/40" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                <div className="section-header justify-between">
                    <div><i className="fas fa-chart-line"></i> <span>MARKET_ERROR</span></div>
                </div>
                <div className="flex-grow flex items-center justify-center text-red-500 font-black text-center" style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}>
                    UNABLE TO REACH EXCHANGE GATEWAY
                </div>
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="tech-border flex flex-col h-full min-h-0 overflow-hidden bg-black/40" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                <div className="section-header justify-between">
                    <div><i className="fas fa-chart-line"></i> <span>MARKET_FEED</span></div>
                </div>
                <div className="flex-grow flex items-center justify-center text-primary font-black animate-pulse" style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}>
                    INITIALIZING TICKER...
                </div>
            </div>
        );
    }

    // Duplicate items for seamless vertical scroll
    const scrollItems = [...stocks, ...stocks];
    const marqueeDuration = `${stocks.length * 5}s`; // Faster scroll for stocks

    return (
        <div className="tech-border flex flex-col h-full min-h-0 overflow-hidden bg-black/40" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
            <div className="section-header justify-between">
                <div className="flex items-center">
                    <i className="fas fa-chart-line"></i>
                    <span className="ml-2">MARKET_INTEL</span>
                </div>
            </div>

            <div className="flex-grow relative overflow-hidden mask-fade">
                <div
                    ref={marqueeRef}
                    className="animate-marquee-vertical flex flex-col"
                    style={{ '--marquee-duration': marqueeDuration, gap: '0.125rem' } as React.CSSProperties}
                >
                    {scrollItems.map((stock, index) => (
                        <div key={`${stock.ticker}-${index}`} className="flex items-center justify-between border-l-4 border-primary pl-2 py-0">
                            <div className="flex items-center">
                                <div className="flex flex-col">
                                    <span className="text-primary font-black leading-none" style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1.6rem)' }}>{stock.ticker}</span>
                                    <span className="text-white/60 font-bold uppercase truncate max-w-[100px]" style={{ fontSize: 'clamp(0.55rem, 0.8vw, 0.75rem)' }}>{stock.name}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="text-white font-black leading-none" style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.8rem)' }}>
                                    {stock.price} <span className="text-[0.6em] text-white/40">{stock.currency}</span>
                                </span>
                                <div className={`flex items-center gap-1 font-black ${stock.isPositive ? 'text-green-500' : 'text-red-500'}`} style={{ fontSize: 'clamp(0.65rem, 1vw, 1.1rem)' }}>
                                    <i className={`fas ${stock.isPositive ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                                    <span>{stock.isPositive ? '+' : ''}{stock.changePercent}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
