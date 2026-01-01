"use client";

import { useEffect, useState, useRef } from "react";

interface NewsItem {
    title: string;
    pubDate: string;
    description: string;
}

type Region = "INDIA" | "USA";

const FEEDS: Record<Region, string> = {
    INDIA: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    USA: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
};

const decodeHtml = (text: string): string => {
    if (!text) return "";
    let decoded = text;
    const entities: Record<string, string> = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
        '&nbsp;': ' '
    };

    for (let i = 0; i < 3; i++) {
        if (!decoded.includes('&')) break;
        decoded = decoded.replace(/&[a-z0-9#]+;/gi, (match) => entities[match.toLowerCase()] || match);
    }
    return decoded;
};

export default function NewsFeed() {
    const [newsData, setNewsData] = useState<Record<Region, NewsItem[]>>({
        INDIA: [],
        USA: []
    });
    const [region, setRegion] = useState<Region>("INDIA");
    const [lastSync, setLastSync] = useState("SYNCING...");
    const [error, setError] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const marqueeRef = useRef<HTMLDivElement>(null);

    const fetchNews = async () => {
        try {
            const results = await Promise.all(
                Object.entries(FEEDS).map(async ([key, url]) => {
                    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    return { key, items: data.status === "ok" ? data.items : [] };
                })
            );

            const fetchedData: any = {};
            results.forEach(({ key, items }) => {
                fetchedData[key] = items.map((item: any) => ({
                    ...item,
                    title: decodeHtml(item.title)
                }));
            });

            setNewsData(fetchedData);
            setError(fetchedData.INDIA.length === 0 && fetchedData.USA.length === 0);
            setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (e) {
            console.error("News fetch error:", e);
            setError(true);
        }
    };

    useEffect(() => {
        fetchNews();
        const refreshTimer = setInterval(fetchNews, 600000); // 10 mins
        return () => clearInterval(refreshTimer);
    }, []);

    // Switch regions every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setRegion((prev) => (prev === "INDIA" ? "USA" : "INDIA"));
                setIsFading(false);
            }, 500);
        }, 300000);
        return () => clearInterval(interval);
    }, []);

    const items = newsData[region];
    // Duplicate items for seamless vertical scroll
    const scrollItems = [...items, ...items];

    // Dynamic duration based on item count
    const marqueeDuration = `${items.length * 15}s`;

    return (
        <div className="tech-border p-6 flex-grow flex flex-col min-h-0 relative overflow-hidden">
            <div className="section-header justify-between z-10 bg-black/50 backdrop-blur-sm -mx-6 px-6 -mt-6 pt-6 pb-2">
                <div>
                    <i className="fas fa-broadcast-tower"></i>
                    <span className="ml-2">INTEL_FEED // </span>
                    <span className="text-primary font-black ml-1 animate-pulse">{region}</span>
                </div>
            </div>

            <div className={`flex-grow relative mt-4 overflow-hidden mask-fade transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {error ? (
                    <div className="text-red-500 font-black font-mono text-center my-auto text-4xl h-full flex items-center justify-center">
                        UPLINK_FAILURE: PACKET LOSS
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-primary font-black animate-pulse uppercase text-center my-auto text-3xl h-full flex items-center justify-center">
                        Establishing satellite uplink...
                    </div>
                ) : (
                    <div
                        ref={marqueeRef}
                        className="animate-marquee-vertical flex flex-col gap-12 py-4"
                        style={{ '--marquee-duration': marqueeDuration } as React.CSSProperties}
                    >
                        {scrollItems.map((item, index) => (
                            <div key={`${region}-${index}`} className="border-l-8 border-primary/50 pl-6 py-2">
                                <div className="text-2xl text-primary font-black tracking-widest mb-2 uppercase">
                                    NODE_{(index % items.length) + 1} // {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-4xl font-black leading-tight uppercase tracking-tighter text-foreground hover:text-primary transition-colors cursor-default drop-shadow-md">
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end mt-auto pt-4 border-t border-neutral-800 z-10 bg-black/50 backdrop-blur-sm -mx-6 px-6 -mb-6 pb-6">
                <div className="last-updated text-white text-xl font-black uppercase">
                    LAST SYNC // {lastSync}
                </div>
                <div className="text-xl font-mono text-white">
                    STREAM_SIZE: {items.length} NODES
                </div>
            </div>
        </div>
    );
}
