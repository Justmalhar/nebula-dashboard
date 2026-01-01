"use client";

export default function FooterTicker() {
    const stationId = process.env.NEXT_PUBLIC_STATION_ID || "SURAT_HUB";

    return (
        <footer className="mt-2 border-t-4 border-primary pt-2 z-10 w-full min-h-0">
            <div className="flex items-center text-2xl font-mono overflow-hidden whitespace-nowrap">
                <span className="bg-primary text-white px-4 py-1 mr-4 font-bold">
                    LIVE_DATA_STREAM
                </span>
                <div className="w-full overflow-hidden">
                    <div className="inline-block animate-ticker">
            // {stationId} SECTOR HUB ONLINE // SECURE CHANNEL ACTIVE // WEATHER REFRESH: 30M // INDIA NEWS REFRESH: 5M // CYCLE: 30S // NO ANOMALIES //
                    </div>
                </div>
            </div>
        </footer>
    );
}
