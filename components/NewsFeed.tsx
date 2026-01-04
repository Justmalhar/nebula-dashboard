"use client";

import { useEffect, useState, useRef } from "react";

interface NewsItem {
    title: string;
    pubDate: string;
    description: string;
}

type Topic = "INDIA" | "USA" | "TECH" | "AI" | "OPENAI" | "NVIDIA" | "ELON" | "TRUMP";

const FEEDS: Record<Topic, string> = {
    INDIA: "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
    USA: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    TECH: "https://news.google.com/rss/search?q=technology&hl=en-US&gl=US&ceid=US:en",
    AI: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en",
    OPENAI: "https://news.google.com/rss/search?q=OpenAI&hl=en-US&gl=US&ceid=US:en",
    NVIDIA: "https://news.google.com/rss/search?q=NVIDIA&hl=en-US&gl=US&ceid=US:en",
    ELON: "https://news.google.com/rss/search?q=Elon+Musk&hl=en-US&gl=US&ceid=US:en",
    TRUMP: "https://news.google.com/rss/search?q=Trump&hl=en-US&gl=US&ceid=US:en"
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
    const [newsData, setNewsData] = useState<Record<Topic, NewsItem[]>>({
        INDIA: [], USA: [], TECH: [], AI: [], OPENAI: [], NVIDIA: [], ELON: [], TRUMP: []
    });
    const [topic, setTopic] = useState<Topic>("INDIA");
    const [lastSync, setLastSync] = useState("SYNCING...");
    const [error, setError] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const marqueeRef = useRef<HTMLDivElement>(null);

    const fetchNews = async () => {
        try {
            const results = await Promise.all(
                Object.entries(FEEDS).map(async ([key, url]) => {
                    try {
                        const res = await fetch(`/api/news?url=${encodeURIComponent(url)}`);
                        const data = await res.json();
                        return { key, items: data.status === "ok" ? data.items : [] };
                    } catch (e) {
                        console.error(`Error fetching feed for ${key}:`, e);
                        return { key, items: [] };
                    }
                })
            );

            const fetchedData: any = {};
            let hasAnyContent = false;
            results.forEach(({ key, items }) => {
                fetchedData[key] = items.map((item: any) => ({
                    ...item,
                    title: decodeHtml(item.title)
                }));
                if (items.length > 0) hasAnyContent = true;
            });

            setNewsData(fetchedData);
            setError(!hasAnyContent);
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

    // Switch topics every 60 seconds
    useEffect(() => {
        const topics = Object.keys(FEEDS) as Topic[];
        const interval = setInterval(() => {
            setIsFading(true);
            setTimeout(() => {
                setTopic((prev) => {
                    const currentIndex = topics.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % topics.length;

                    // If next topic is empty, try to find the next available one
                    let finalIndex = nextIndex;
                    let attempts = 0;
                    while (newsData[topics[finalIndex]].length === 0 && attempts < topics.length) {
                        finalIndex = (finalIndex + 1) % topics.length;
                        attempts++;
                    }
                    return topics[finalIndex];
                });
                setIsFading(false);
            }, 500);
        }, 60000);
        return () => clearInterval(interval);
    }, [newsData]);

    const items = newsData[topic] || [];
    // Duplicate items for seamless vertical scroll
    const scrollItems = [...items, ...items];

    // Dynamic duration based on item count
    const marqueeDuration = `${items.length * 15}s`;

    return (
        <div className="tech-border flex-grow flex flex-col min-h-0 relative overflow-hidden" style={{ padding: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}>
            <div className="section-header justify-between z-10 bg-black/50 backdrop-blur-sm -mx-6 px-6 -mt-6 pt-6 pb-2" style={{ margin: `clamp(-0.75rem, -1.5vw, -1.5rem) clamp(-0.75rem, -1.5vw, -1.5rem) 0`, padding: `clamp(0.75rem, 1.5vw, 1.5rem) clamp(0.75rem, 1.5vw, 1.5rem) 0.5rem` }}>
                <div>
                    <i className="fas fa-broadcast-tower"></i>
                    <span className="ml-2">INTEL_FEED // </span>
                    <span className="text-primary font-black ml-1 animate-pulse">{topic}</span>
                </div>
            </div>

            <div className={`flex-grow relative overflow-hidden mask-fade transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`} style={{ marginTop: 'clamp(0.5rem, 1vw, 1rem)' }}>
                {error ? (
                    <div className="text-red-500 font-black font-mono text-center my-auto h-full flex items-center justify-center" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                        UPLINK_FAILURE: PACKET LOSS
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-primary font-black animate-pulse uppercase text-center my-auto h-full flex items-center justify-center" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}>
                        Establishing satellite uplink...
                    </div>
                ) : (
                    <div
                        ref={marqueeRef}
                        className="animate-marquee-vertical flex flex-col py-4"
                        style={{ '--marquee-duration': marqueeDuration, gap: 'clamp(1.5rem, 3vw, 3rem)' } as React.CSSProperties}
                    >
                        {scrollItems.map((item, index) => (
                            <div key={`${topic}-${index}`} className="border-primary/50 py-2" style={{ borderLeftWidth: 'clamp(2px, 0.4vw, 8px)', borderLeftStyle: 'solid', paddingLeft: 'clamp(0.5rem, 1.2vw, 1.5rem)' }}>
                                <div className="text-primary font-black uppercase" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.5rem)', letterSpacing: '0.1em', marginBottom: 'clamp(0.125rem, 0.3vw, 0.5rem)' }}>
                                    NODE_{(index % items.length) + 1} // {new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="font-black leading-tight uppercase tracking-tighter text-foreground hover:text-primary transition-colors cursor-default drop-shadow-md" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.5rem)' }}>
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
