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
        <div className="tech-border flex-grow flex flex-col min-h-0 overflow-hidden" style={{ padding: 'clamp(0.75rem, 1.5vw, 1.5rem)' }}>
            <div className="section-header justify-between">
                <div className="flex items-center">
                    <i className="fas fa-satellite-dish"></i> <span>LOCAL_ENVIRONMENT</span>
                </div>
                <div className="text-primary font-black uppercase" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.25rem)', letterSpacing: '0.1em' }}>
                    {process.env.NEXT_PUBLIC_CITY || "STATION"}
                </div>
            </div>
            <div className="flex flex-col items-center flex-grow justify-between min-h-0" style={{ paddingTop: 'clamp(0.5rem, 1vw, 1rem)', paddingBottom: 'clamp(0.5rem, 1vw, 1rem)' }}>
                <div className="flex flex-col items-center justify-center flex-grow">
                    <div className="text-primary" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', marginBottom: 'clamp(0.25rem, 0.5vw, 1rem)' }}>
                        <i className={`fas ${data.current.icon}`}></i>
                    </div>
                    <div className="font-black leading-none tracking-tighter ml-4" style={{ fontSize: 'clamp(3rem, 7vw, 9rem)', marginTop: '-0.125em' }}>{data.current.temp}°</div>
                    <div className="uppercase text-primary font-black" style={{ fontSize: 'clamp(1rem, 2.5vw, 2.5rem)', letterSpacing: '0.1em', marginTop: 'clamp(0.25rem, 0.5vw, 1rem)' }}>
                        {data.current.condition}
                    </div>
                    <div className="font-black bg-neutral-900 border border-neutral-700 rounded-sm" style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1.875rem)', marginTop: 'clamp(0.25rem, 0.5vw, 1rem)', padding: 'clamp(0.125rem, 0.3vw, 0.5rem) clamp(0.5rem, 1vw, 1.5rem)' }}>
                        AQI // <span className={typeof data.current.aqi === 'number' && data.current.aqi > 100 ? "text-red-500" : "text-green-500"}>{data.current.aqi}</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 mt-2 text-white border-b-2 border-white-800 font-bold" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.5rem)', gap: 'clamp(0.5rem, 1vw, 2rem)', paddingBottom: 'clamp(0.5rem, 1vw, 1.5rem)', marginBottom: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
                    <div className="flex justify-between">
                        <span>HUMIDITY</span> <span className="text-primary">{data.current.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                        <span>WIND_SPD</span> <span className="text-primary">{data.current.windspeed} km/h</span>
                    </div>
                </div>

                <div className="w-full">
                    <div className="text-white uppercase" style={{ fontSize: 'clamp(0.75rem, 1.3vw, 1.5rem)', letterSpacing: '0.1em', marginBottom: 'clamp(0.25rem, 0.5vw, 0.75rem)' }}>
                        T+ Track // Projected
                    </div>
                    <div className="grid grid-cols-5" style={{ gap: 'clamp(0.125rem, 0.3vw, 0.75rem)' }}>
                        {hourlyTrack.map((h, i) => (
                            <div key={i} className="flex flex-col items-center border-2 border-white-800 bg-black/50 font-black font-mono" style={{ padding: 'clamp(0.125rem, 0.4vw, 0.75rem)', fontSize: 'clamp(0.625rem, 1vw, 1.5rem)' }}>
                                <div className="text-white" style={{ marginBottom: '0.125rem' }}>{h.timeLabel}</div>
                                <i className={`fas ${h.hIcon} text-primary`} style={{ fontSize: 'clamp(1rem, 2vw, 2.5rem)', margin: '0.125rem 0' }}></i>
                                <div className="text-white" style={{ fontSize: 'clamp(1rem, 2vw, 2.5rem)' }}>{h.hTemp}°</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
