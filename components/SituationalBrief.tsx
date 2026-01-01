"use client";

import { useEffect, useState } from "react";

export default function SituationalBrief() {
    const [brief, setBrief] = useState("Analyzing atmospheric and chronological data...");

    useEffect(() => {
        // This could eventually be more dynamic, but for now it's a simple logic-based message
        const hour = new Date().getHours();
        let greeting = "SYSTEM_READY.";
        if (hour < 12) greeting = "GOOD MORNING.";
        else if (hour < 18) greeting = "GOOD AFTERNOON.";
        else greeting = "GOOD EVENING.";

        // Example logic from the original HTML
        setBrief(`> ${greeting} SKIES ARE CLEAR OVER SURAT. TEMPERATURE NOMINAL. // STAY PRODUCTIVE.`);
    }, []);

    return (
        <div className="tech-border p-4 flex-grow flex flex-col min-h-0">
            <div className="section-header">
                <i className="fas fa-comment-alt"></i> <span>SITUATIONAL_BRIEF</span>
            </div>
            <div className="text-lg font-mono text-gray-600 leading-relaxed italic overflow-y-auto min-h-0 flex-grow no-scrollbar">
                {brief}
            </div>
        </div>
    );
}
