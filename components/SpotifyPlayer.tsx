"use client";

import { useEffect, useState } from "react";

interface SpotifyData {
    album?: string;
    albumImageUrl?: string;
    artist?: string;
    isPlaying: boolean;
    songUrl?: string;
    title?: string;
    progressMs?: number;
    durationMs?: number;
    error?: string;
}

export default function SpotifyPlayer() {
    const [data, setData] = useState<SpotifyData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/spotify');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error("Failed to fetch Spotify status", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (action: string) => {
        try {
            await fetch('/api/spotify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            // Refresh status after action
            setTimeout(fetchStatus, 500);
        } catch (error) {
            console.error(`Failed to ${action}`, error);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 4000); // Poll every 4s
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-neutral-800 rounded-sm"></div>
                <div className="flex flex-col space-y-2">
                    <div className="h-4 w-24 bg-neutral-800 rounded-sm"></div>
                    <div className="h-3 w-32 bg-neutral-800 rounded-sm"></div>
                </div>
            </div>
        );
    }

    if (!data || !data.title) {
        return (
            <div className="flex items-center px-4 py-2 bg-black/40 border border-neutral-800 rounded-sm">
                <i className="fab fa-spotify text-primary mr-3 text-xl"></i>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">System_Idle // No_Signal</span>
            </div>
        );
    }

    const progressPercentage = data.progressMs && data.durationMs
        ? (data.progressMs / data.durationMs) * 100
        : 0;

    return (
        <div className="flex items-center bg-black/60 border border-primary  backdrop-blur-md p-2 rounded-sm relative overflow-hidden group min-w-[300px] max-w-[450px]">
            {/* Background progress bar */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-primary/70 transition-all duration-1000 z-20"
                style={{ width: `${progressPercentage}%` }}
            ></div>

            {/* Album Art */}
            <div
                className="relative w-12 h-12 flex-shrink-0 mr-4 border-2 border-primary/50 rounded-none shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            >
                {data.albumImageUrl ? (
                    <img src={data.albumImageUrl} alt={data.album} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <i className="fas fa-music text-primary/50"></i>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-grow min-w-0 mr-4">
                <div className="text-primary font-black uppercase truncate leading-tight" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
                    {data.title}
                </div>
                <div className="text-white font-mono truncate leading-none mt-1" style={{ fontSize: '0.625rem', letterSpacing: '0.1em' }}>
                    {data.artist}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3 text-white pr-2">
                <button
                    onClick={() => handleAction('previous')}
                    className="hover:text-white transition-colors cursor-pointer"
                >
                    <i className="fas fa-backward-step text-sm"></i>
                </button>
                <button
                    onClick={() => handleAction(data.isPlaying ? 'pause' : 'play')}
                    className="hover:text-white transition-colors cursor-pointer bg-primary/50 w-8 h-8 rounded-full flex items-center justify-center border border-primary/30"
                >
                    <i className={`fas ${data.isPlaying ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                </button>
                <button
                    onClick={() => handleAction('next')}
                    className="hover:text-white transition-colors cursor-pointer"
                >
                    <i className="fas fa-forward-step text-sm"></i>
                </button>
            </div>

            {/* Scanline effect for the player */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
        </div>
    );
}
