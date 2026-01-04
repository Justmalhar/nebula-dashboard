"use client";

import { useEffect, useState } from "react";
import SpotifyPlayer from "./SpotifyPlayer";

export default function Clock() {
    const [time, setTime] = useState(new Date());
    const [uptime, setUptime] = useState("00:00:00");

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        const startTime = performance.now();
        const uptimeTimer = setInterval(() => {
            const up = Math.floor((performance.now() - startTime) / 1000);
            const h = String(Math.floor(up / 3600)).padStart(2, '0');
            const m = String(Math.floor((up % 3600) / 60)).padStart(2, '0');
            const s = String(up % 60).padStart(2, '0');
            setUptime(`${h}:${m}:${s}`);
        }, 1000);

        return () => {
            clearInterval(timer);
            clearInterval(uptimeTimer);
        };
    }, []);

    const hours = time.getHours() % 12 || 12;
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedDate = time.toLocaleDateString('en-US', dateOptions).toUpperCase();

    const stationId = process.env.NEXT_PUBLIC_STATION_ID || "STATION_HUB";

    return (
        <header className="flex justify-between items-start mb-0.5 z-10 w-full shrink-0">
            <div className="flex flex-col">
                <div className="flex items-center leading-none">
                    <h1 className="font-black tracking-tighter leading-none flex items-center" style={{ fontSize: 'clamp(3rem, 6vw, 6rem)' }}>
                        {hours}<span className="font-black mx-2 relative" style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)', top: '-0.1em' }}>:</span>{minutes}
                    </h1>
                    <span className="font-black text-primary -mt-7" style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)', marginLeft: 'clamp(0.5rem, 1vw, 1rem)', marginBottom: '-1.5em' }}>
                        {ampm}
                    </span>
                </div>
                <div className="font-mono text-primary font-bold pl-1" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.875rem)', letterSpacing: 'clamp(0.1em, 0.3vw, 0.2em)', marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                    {formattedDate}
                </div>
            </div>

            <div className="hidden lg:flex items-center justify-center flex-grow px-8 mt-6">
                <SpotifyPlayer />
            </div>

            <div className="flex flex-col items-end" style={{ paddingTop: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                <div className="bg-primary text-white font-black uppercase" style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.875rem)', padding: 'clamp(0.125rem, 0.3vw, 0.25rem) clamp(0.5rem, 1vw, 1rem)', letterSpacing: 'clamp(0.1em, 0.2vw, 0.2em)' }}>
                    STATION // {stationId}
                </div>
                <div className="font-mono text-white-500 uppercase" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 1.5rem)', marginTop: 'clamp(0.25rem, 0.5vw, 0.5rem)' }}>
                    <span className="text-primary">Status:</span> Nominal / Tracking Active
                </div>
                <div className="font-mono text-white-500 uppercase" style={{ fontSize: 'clamp(0.625rem, 1.2vw, 1.5rem)' }}>
                    <span className="text-primary">Session:</span> <span>{uptime}</span>
                </div>
            </div>
        </header>
    );
}
