"use client";

import { useEffect, useState, useRef } from "react";

interface Notification {
    appId: string;
    title: string;
    subtitle: string;
    body: string;
    date: string;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotifications(data);
            }
            setLoading(false);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="tech-border p-8 flex-grow flex flex-col items-center justify-center h-full">
                <div className="section-header w-full">
                    <i className="fas fa-bell"></i> <span>SECURE_DATA_FEED</span>
                </div>
                <div className="text-2xl font-black animate-pulse">
                    LINKING TO SYSTEM_NOTIFICATIONS...
                </div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="tech-border p-8 flex-grow flex flex-col items-center justify-center h-full">
                <div className="section-header w-full">
                    <i className="fas fa-bell"></i> <span>SECURE_DATA_FEED</span>
                </div>
                <div className="text-xl font-black uppercase text-neutral-500">
                    NO_ACTIVE_INCIDENTS
                </div>
            </div>
        );
    }

    return (
        <div className="tech-border flex-grow flex flex-col min-h-0 overflow-hidden h-full" style={{ padding: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}>
            <div className="section-header justify-between">
                <div className="flex items-center">
                    <i className="fas fa-bell"></i> <span>NOTIFICATIONS_FEED</span>
                </div>
                <div className="text-primary font-black animate-pulse text-[10px]">
                    <i className="fas fa-circle animate-pulse text-primary text-[10px]"></i>
                    <span className="text-primary font-black animate-pulse text-[10px]">LIVE</span>
                </div>
            </div>

            <div className="flex-grow overflow-hidden relative mt-4">
                <div
                    className="flex flex-col gap-6 animate-marquee-vertical"
                    style={{ animationDuration: `${notifications.length * 8}s` }}
                >
                    {/* Triple notifications for smoother seamless loop on large screens */}
                    {[...notifications, ...notifications, ...notifications].map((notif, i) => (
                        <div key={i} className="bg-black/40 border-l-4 border-primary p-5 backdrop-blur-sm relative group">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`/api/icons?appId=${notif.appId}`}
                                        alt=""
                                        className="w-6 h-6 object-contain grayscale group-hover:grayscale-0 transition-all opacity-70 group-hover:opacity-100"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImdyYXkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCI+PC9jaXJjbGU+PHBhdGggZD0iTTEyIDh2NCI+PC9wYXRoPjxwYXRoIGQ9Ik0xMiAxNmguMDEiPjwvcGF0aD48L3N2Zz4=';
                                        }}
                                    />
                                    <span className="text-xs font-mono text-primary uppercase tracking-[0.2em] font-black">
                                        {notif.appId.split('.').pop()}
                                    </span>
                                </div>
                                <span className="text-xs font-mono text-neutral-500 font-bold">
                                    {new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="text-white font-black uppercase tracking-tight leading-tight" style={{ fontSize: '1.25rem' }}>
                                {notif.title}
                            </div>
                            {notif.body && (
                                <div className="text-neutral-300 font-mono mt-2 leading-relaxed" style={{ fontSize: '0.875rem' }}>
                                    {notif.body}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Visual indicators */}
            <div className="mt-4 border-t border-neutral-800 pt-3 flex justify-between items-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
                <span>Buffer: {notifications.length} Nodes</span>
                <span className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-ping"></span>
                    Operational
                </span>
            </div>

            <style jsx>{`
                @keyframes marquee-vertical {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-33.33%); }
                }
                .animate-marquee-vertical {
                    animation-name: marquee-vertical;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
