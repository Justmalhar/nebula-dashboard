"use client";

import { useEffect, useState } from "react";

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
                    <h1 className="text-8xl font-black tracking-tighter leading-none flex items-center -mb-2">
                        {hours}<span className="text-5xl font-black mx-4 relative -top-1">:</span>{minutes}
                    </h1>
                    <span className="text-5xl font-black ml-4 -mb-10 text-primary">
                        {ampm}
                    </span>
                </div>
                <div className="text-3xl font-mono text-primary tracking-widest mt-2 pl-1 font-bold">
                    {formattedDate}
                </div>
            </div>

            <div className="flex flex-col items-end pt-2">
                <div className="bg-primary text-white px-4 py-1 text-3xl font-black tracking-widest uppercase">
                    STATION // {stationId}
                </div>
                <div className="text-2xl font-mono mt-2 text-white-500 uppercase">
                    Status: Nominal / Tracking Active
                </div>
                <div className="text-2xl font-mono text-white-500 uppercase">
                    Session: <span>{uptime}</span>
                </div>
            </div>
        </header>
    );
}
