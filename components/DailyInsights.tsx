"use client";

import { useEffect, useState } from "react";

export default function DailyInsights() {
    const [wisdom, setWisdom] = useState<{ quote: string; author: string; word: string; definition: string }>({
        quote: "Syncing with wisdom nodes...",
        author: "SYSTEM",
        word: "KAIZEN",
        definition: "Continuous improvement through small, incremental changes."
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeInsight, setActiveInsight] = useState<'word' | 'quote'>('word');

    useEffect(() => {
        const fetchInsight = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/insights');
                const data = await response.json();

                setWisdom({
                    quote: data.quote,
                    author: data.author.toUpperCase(),
                    word: data.word,
                    definition: data.definition
                });
            } catch (error) {
                console.error("UPLINK_ERROR:", error);
                setWisdom({
                    quote: "The quieter you become, the more you are able to hear.",
                    author: "RUMI",
                    word: "RESILIENCE",
                    definition: "The capacity to recover quickly from difficulties; toughness."
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsight();

        // Refresh every hour
        const refreshInterval = setInterval(fetchInsight, 60 * 60 * 1000);
        return () => clearInterval(refreshInterval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveInsight(prev => prev === 'word' ? 'quote' : 'word');
        }, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="tech-border p-8 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="section-header">
                <i className="fas fa-scroll"></i> <span>WISDOM_UPLINK</span>
            </div>

            <div className={`flex-grow flex flex-col justify-center transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {activeInsight === 'word' ? (
                    <div key="word" className="flex flex-col gap-2 border-l-4 border-primary/30 pl-6 py-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="text-md text-white font-mono uppercase tracking-[3px] mb-1">WORD_OF_DAY</div>
                        <div className="text-5xl font-black text-primary tracking-tighter leading-tight">{wisdom.word}</div>
                        <div className="text-xl text-white font-mono leading-snug italic mt-2">
                            {wisdom.definition}
                        </div>
                    </div>
                ) : (
                    <div key="quote" className="flex flex-col gap-4 relative mt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <i className="fas fa-quote-left text-primary/20 text-5xl absolute -top-2 -left-4"></i>
                        <div className="text-3xl font-black leading-tight uppercase tracking-tight text-foreground pl-10">
                            {isLoading ? "ESTABLISHING_NEURAL_LINK..." : `"${wisdom.quote}"`}
                        </div>
                        {!isLoading && (
                            <div className="text-right text-md font-mono text-primary font-bold tracking-widest mt-2">
                                // SOURCE: <span className="text-white">{wisdom.author}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="last-updated mt-6 text-white">
                NEURAL_SYNC: <span className="font-bold">{isLoading ? "BUSY" : "SUCCESSFUL"}</span> // MODE: <span className="font-bold">{activeInsight.toUpperCase()}</span>
            </div>
        </div>
    );
}
