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
        <div className="tech-border p-6 flex flex-col h-full min-h-0 overflow-hidden">
            <div className="section-header justify-between">
                <div><i className="fas fa-calendar-alt"></i> <span>MONTHLY_OUTLOOK</span></div>
            </div>
            <div className="flex-grow flex flex-col justify-center max-w-[95%] mx-auto w-full">
                <div className="text-3xl font-black text-primary mb-4 text-center tracking-tight">
                    {currentMonth} {currentYear}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-2xl text-white mb-2 font-bold">
                    <div>SU</div>
                    <div>MO</div>
                    <div>TU</div>
                    <div>WE</div>
                    <div>TH</div>
                    <div>FR</div>
                    <div>SA</div>
                </div>
                <div className="grid grid-cols-7 gap-1 flex-grow min-h-0 text-2xl font-black">
                    {gridItems}
                </div>
            </div>
        </div>
    );
}
