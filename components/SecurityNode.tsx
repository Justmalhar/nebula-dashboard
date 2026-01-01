"use client";

export default function SecurityNode() {
    const lat = process.env.NEXT_PUBLIC_LAT || "21.17";
    const lon = process.env.NEXT_PUBLIC_LON || "72.83";

    return (
        <div className="tech-border p-4 flex-grow flex flex-col items-center justify-center min-h-0">
            <div className="section-header w-full">
                <i className="fas fa-shield-alt"></i> <span>SECURITY_NODE</span>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center min-h-0 overflow-hidden w-full">
                <i className="fas fa-qrcode text-5xl text-gray-800 mb-2 flex-shrink-0"></i>
                <div className="text-xs font-mono text-primary tracking-tighter whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">
                    NODE_IDENT: {lat}N_{lon}E
                </div>
            </div>
        </div>
    );
}
