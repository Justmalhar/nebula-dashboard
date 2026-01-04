"use client";

import { useEffect, useState } from "react";

export default function FooterTicker() {
    const stationId = process.env.NEXT_PUBLIC_STATION_ID || "SURAT_HUB";
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="border-primary mb-2 z-10 w-full min-h-0" style={{ marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)', borderTopWidth: 'clamp(2px, 0.3vw, 4px)', borderTopStyle: 'solid', paddingTop: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
            <div className="flex items-center font-mono overflow-hidden whitespace-nowrap" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 1.5rem)' }}>
                <span className="bg-primary text-white font-bold" style={{ padding: 'clamp(0.125rem, 0.25vw, 0.25rem) clamp(0.5rem, 0.8vw, 1rem)', marginRight: 'clamp(0.5rem, 0.8vw, 1rem)' }}>
                    LIVE_DATA_STREAM
                </span>
                <div className="w-full overflow-hidden">
                    <div className="inline-block animate-ticker">
                        // <span className="text-primary">{stationId}</span> SECTOR HUB ONLINE // <span className="text-primary">SECURE CHANNEL</span> ACTIVE // <span className="text-primary">WEATHER</span> REFRESH: 30M // <span className="text-primary">NEWS</span> REFRESH: 10M // <span className="text-primary">WISDOM</span> REFRESH: 1H // <span className="text-primary">LAST SYNC</span>: {currentTime || "SYNCING..."} // NO ANOMALIES //
                    </div>
                </div>
            </div>
        </footer>
    );
}
