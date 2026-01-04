"use client";

import { useState, useEffect } from "react";
import Clock from "@/components/Clock";
import Weather from "@/components/Weather";
import Notifications from "@/components/Notifications";
import NewsFeed from "@/components/NewsFeed";
import RightPanelSwitch from "@/components/RightPanelSwitch";
import DailyInsights from "@/components/DailyInsights";
import FooterTicker from "@/components/FooterTicker";

export default function Home() {
  const [activeWidget, setActiveWidget] = useState<'weather' | 'notifications'>('weather');

  useEffect(() => {
    const duration = activeWidget === 'weather' ? 15000 : 120000;
    const timer = setTimeout(() => {
      setActiveWidget(prev => prev === 'weather' ? 'notifications' : 'weather');
    }, duration);

    return () => clearTimeout(timer);
  }, [activeWidget]);

  return (
    <main className="flex flex-col relative h-screen w-screen overflow-hidden" style={{ padding: 'clamp(0.75rem, 1.5vw, 1.5rem)', gap: 'clamp(0.5rem, 1vw, 1rem)' }}>
      <Clock />

      <div className="flex-grow grid grid-cols-12 z-10 min-h-0 overflow-hidden" style={{ gap: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
        {/* Left: Local Environment (Weather / Notifications Cycle) */}
        <section className="col-span-4 flex flex-col min-h-0 relative">
          <div className={`flex flex-col min-h-0 h-full transition-opacity duration-1000 ${activeWidget === 'weather' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
            <Weather />
          </div>
          <div className={`flex flex-col min-h-0 h-full transition-opacity duration-1000 ${activeWidget === 'notifications' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'}`}>
            <Notifications />
          </div>
        </section>

        {/* Center: Global Intel (News Cycling) */}
        <section className="col-span-5 flex flex-col min-h-0">
          <NewsFeed />
        </section>

        {/* Right: Monthly Outlook & Insights */}
        <section className="col-span-3 flex flex-col min-h-0" style={{ gap: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
          <div className="flex-[3] min-h-0">
            <RightPanelSwitch />
          </div>
          <div className="flex-[2] min-h-0">
            <DailyInsights />
          </div>
        </section>
      </div>

      <FooterTicker />
    </main>
  );
}
