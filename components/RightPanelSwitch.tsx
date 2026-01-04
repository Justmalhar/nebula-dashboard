"use client";

import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import StockTicker from "./StockTicker";

export default function RightPanelSwitch() {
    const [view, setView] = useState<"CALENDAR" | "STOCKS">("CALENDAR");

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const switchToStocks = () => {
            setView("STOCKS");
            timer = setTimeout(switchToCalendar, 300000); // 5 minutes
        };

        const switchToCalendar = () => {
            setView("CALENDAR");
            timer = setTimeout(switchToStocks, 30000); // 30 seconds
        };

        // Start the cycle
        timer = setTimeout(switchToStocks, 30000); // Initial 30s for calendar

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full relative">
            <div className={`h-full transition-all duration-700 ease-in-out ${view === "CALENDAR" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-95 -rotate-1 pointer-events-none absolute inset-0"}`}>
                <Calendar />
            </div>
            <div className={`h-full transition-all duration-700 ease-in-out ${view === "STOCKS" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-95 rotate-1 pointer-events-none absolute inset-0"}`}>
                <StockTicker />
            </div>
        </div>
    );
}
