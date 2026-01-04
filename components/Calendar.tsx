"use client";

export default function Calendar() {
    const now = new Date();
    const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];

    const currentMonth = monthNames[now.getMonth()];
    const currentYear = now.getFullYear();
    const today = now.getDate();

    const firstDay = new Date(currentYear, now.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentYear, now.getMonth() + 1, 0).getDate();

    const gridItems = [];
    // Empty slots for days before the first of the month
    for (let i = 0; i < firstDay; i++) {
        gridItems.push(<div key={`empty-${i}`} />);
    }
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const isToday = i === today;
        gridItems.push(
            <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}>
                {i}
            </div>
        );
    }

    return (
        <div className="tech-border flex flex-col h-full min-h-0 overflow-hidden" style={{ padding: 'clamp(0.5rem, 1vw, 1.5rem)' }}>
            <div className="section-header justify-between text-md">
                <div><i className="fas fa-calendar-alt"></i> <span>MONTHLY_OUTLOOK</span></div>
            </div>
            <div className="flex-grow flex flex-col justify-center max-w-[95%] mx-auto w-full">
                <div className="font-black text-primary text-center tracking-tight" style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1.875rem)', marginBottom: 'clamp(0.25rem, 0.5vw, 1rem)' }}>
                    {currentMonth} {currentYear}
                </div>
                <div className="grid grid-cols-7 text-center font-mono text-white font-bold" style={{ gap: 'clamp(1px, 0.2vw, 4px)', fontSize: 'clamp(0.625rem, 1.2vw, 1.5rem)', marginBottom: 'clamp(0.125rem, 0.25vw, 0.5rem)' }}>
                    <div>SU</div>
                    <div>MO</div>
                    <div>TU</div>
                    <div>WE</div>
                    <div>TH</div>
                    <div>FR</div>
                    <div>SA</div>
                </div>
                <div className="grid grid-cols-7 flex-grow min-h-0 font-black" style={{ gap: 'clamp(1px, 0.2vw, 4px)' }}>
                    {gridItems}
                </div>
            </div>
        </div>
    );
}
