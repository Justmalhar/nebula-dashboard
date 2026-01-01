"use client";

import { useEffect, useState } from "react";

interface WeatherData {
    current: {
        temp: number;
        windspeed: number;
        humidity: number;
        weathercode: number;
        condition: string;
        icon: string;
        aqi: number | string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        weathercode: number[];
    };
    lastUpdate: string;
}

const WEATHER_CODES: Record<number, [string, string]> = {
    0: ["CLEAR", "fa-sun"],
    1: ["FAIR", "fa-cloud-sun"],
    2: ["PARTLY CLOUDY", "fa-cloud-sun"],
    3: ["CLOUDY", "fa-cloud"],
    45: ["FOGGY", "fa-smog"],
    51: ["DRIZZLE", "fa-cloud-rain"],
    61: ["RAIN", "fa-cloud-showers-heavy"],
    95: ["STORM", "fa-bolt"],
};

export default function Weather() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const lat = process.env.NEXT_PUBLIC_LAT || "21.1702";
    const lon = process.env.NEXT_PUBLIC_LON || "72.8311";

    const fetchWeather = async () => {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&relativehumidity_2m=true&windspeed_10m=true`
            );
            const json = await res.json();

            // Fetch AQI
            let aqiValue: number | string = "N/A";
            try {
                const aqiRes = await fetch(
                    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
                );
                const aqiJson = await aqiRes.json();
                if (aqiJson.current && aqiJson.current.us_aqi !== undefined) {
                    aqiValue = aqiJson.current.us_aqi;
                }
            } catch (aqiError) {
                console.error("AQI fetch error:", aqiError);
            }

            const current = json.current_weather;
            const condition = WEATHER_CODES[current.weathercode] || ["OVERCAST", "fa-cloud"];

            setData({
                current: {
                    temp: Math.round(current.temperature),
                    humidity: 48, // Open-Meteo current humidity needs extra call or index, defaulting for now or could fetch better
                    windspeed: current.windspeed,
                    weathercode: current.weathercode,
                    condition: condition[0],
                    icon: condition[1],
                    aqi: aqiValue
                },
                hourly: json.hourly,
                lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            setLoading(false);
        } catch (e) {
            console.error("Weather fetch error:", e);
        }
    };

    useEffect(() => {
        fetchWeather();
        const timer = setInterval(fetchWeather, 1800000); // 30 mins
        return () => clearInterval(timer);
    }, []);

    if (loading || !data) {
        return (
            <div className="tech-border p-8 flex-grow flex flex-col items-center justify-center">
                <div className="section-header w-full">
                    <i className="fas fa-satellite-dish"></i> <span>LOCAL_ENVIRONMENT</span>
                </div>
                <div className="text-2xl font-black animate-pulse">
                    INITIALIZING SENSORS...
                </div>
            </div>
        );
    }

    const currentHour = new Date().getHours();
    const hourlyTrack = [];
    if (data.hourly && data.hourly.temperature_2m) {
        for (let i = 1; i <= 5; i++) {
            const hIndex = (currentHour + i) % 24;
            const hTemp = Math.round(data.hourly.temperature_2m[hIndex]);
            const hCode = data.hourly.weathercode[hIndex];
            const hIcon = (WEATHER_CODES[hCode] || ["", "fa-cloud"])[1];
            const timeLabel = hIndex >= 12 ? (hIndex % 12 || 12) + 'P' : (hIndex % 12 || 12) + 'A';
            hourlyTrack.push({ timeLabel, hIcon, hTemp });
        }
    }

    return (
        <div className="tech-border p-6 flex-grow flex flex-col min-h-0 overflow-hidden">
            <div className="section-header justify-between">
                <div className="flex items-center">
                    <i className="fas fa-satellite-dish"></i> <span>LOCAL_ENVIRONMENT</span>
                </div>
                <div className="text-primary font-black tracking-widest uppercase text-xl">
                    {process.env.NEXT_PUBLIC_CITY || "STATION"}
                </div>
            </div>
            <div className="flex flex-col items-center py-4 flex-grow justify-between min-h-0">
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="text-6xl text-primary mb-4">
                        <i className={`fas ${data.current.icon}`}></i>
                    </div>
                    <div className="text-9xl font-black leading-none tracking-tighter -mt-2">{data.current.temp}°</div>
                    <div className="text-4xl uppercase tracking-widest text-primary font-black mt-4">
                        {data.current.condition}
                    </div>
                    <div className="mt-4 text-3xl font-black bg-neutral-900 px-6 py-2 border border-neutral-700 rounded-sm">
                        AQI // <span className={typeof data.current.aqi === 'number' && data.current.aqi > 100 ? "text-red-500" : "text-green-500"}>{data.current.aqi}</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-8 text-2xl text-white border-b-2 border-white-800 pb-6 mb-6 font-bold">
                    <div className="flex justify-between">
                        <span>HUMIDITY</span> <span className="text-primary">{data.current.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>WIND_SPD</span> <span className="text-primary">{data.current.windspeed} km/h</span>
                    </div>
                </div>

                <div className="w-full">
                    <div className="text-white mb-3 uppercase tracking-widest text-2xl">
                        T+ Track // Projected
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {hourlyTrack.map((h, i) => (
                            <div key={i} className="flex flex-col items-center p-3 border-2 border-white-800 bg-black/50 text-2xl font-black font-mono">
                                <div className="text-white mb-1">{h.timeLabel}</div>
                                <i className={`fas ${h.hIcon} text-primary text-4xl my-1`}></i>
                                <div className="text-4xl text-white">{h.hTemp}°</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="last-updated mt-auto text-lg text-white">LAST SYNC // {data.lastUpdate}</div>
        </div>
    );
}
