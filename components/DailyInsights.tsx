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
    const [lastSync, setLastSync] = useState<string>("SYNCING...");

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
                setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
        <div className="tech-border flex flex-col h-full min-h-0 overflow-hidden" style={{ padding: 'clamp(0.5rem, 1vw, 2rem)' }}>
            <div className="section-header">
                <i className="fas fa-scroll"></i> <span>WISDOM_UPLINK</span>
            </div>

            <div className={`flex-grow flex flex-col justify-center transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                {activeInsight === 'word' ? (
                    <div key="word" className="flex flex-col border-primary/30 py-2 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ gap: 'clamp(0.125rem, 0.3vw, 0.5rem)', borderLeftWidth: 'clamp(2px, 0.3vw, 4px)', borderLeftStyle: 'solid', paddingLeft: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                        <div className="text-white font-mono uppercase" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.875rem)', letterSpacing: '0.15em', marginBottom: '0.125rem' }}>WORD_OF_DAY</div>
                        <div className="font-black text-primary tracking-tighter leading-tight" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 3rem)' }}>{wisdom.word}</div>
                        <div className="text-white font-mono leading-snug italic" style={{ fontSize: 'clamp(0.625rem, 1vw, 1.25rem)', marginTop: 'clamp(0.125rem, 0.25vw, 0.5rem)' }}>
                            {wisdom.definition}
                        </div>
                    </div>
                ) : (
                    <div key="quote" className="-mt-4 flex flex-col relative animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ gap: 'clamp(0.25rem, 0.5vw, 1rem)', marginTop: '0.5rem' }}>
                        <i className="fas fa-quote-left text-primary/20 absolute" style={{ fontSize: 'clamp(1.5rem, 3vw, 3rem)', top: '-0.5rem', left: '-0.25rem' }}></i>
                        <div className="font-black leading-tight uppercase tracking-tight text-foreground" style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.875rem)', paddingLeft: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>
                            {isLoading ? "ESTABLISHING_NEURAL_LINK..." : `"${wisdom.quote}"`}
                        </div>
                        {!isLoading && (
                            <div className="text-right font-mono text-primary font-bold" style={{ fontSize: 'clamp(0.5rem, 0.8vw, 0.875rem)', letterSpacing: '0.1em', marginTop: 'clamp(0.125rem, 0.25vw, 0.5rem)' }}>
                                // SOURCE: <span className="text-white">{wisdom.author}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
