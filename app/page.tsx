import Clock from "@/components/Clock";
import Weather from "@/components/Weather";
import NewsFeed from "@/components/NewsFeed";
import Calendar from "@/components/Calendar";
import DailyInsights from "@/components/DailyInsights";
import FooterTicker from "@/components/FooterTicker";

export default function Home() {
  return (
    <main className="flex flex-col p-6 relative h-screen w-screen overflow-hidden gap-4">
      <Clock />

      <div className="flex-grow grid grid-cols-12 gap-6 z-10 min-h-0">
        {/* Left: Local Environment (Weather) */}
        <section className="col-span-4 flex flex-col min-h-0">
          <Weather />
        </section>

        {/* Center: Global Intel (News Cycling) */}
        <section className="col-span-5 flex flex-col min-h-0">
          <NewsFeed />
        </section>

        {/* Right: Monthly Outlook & Insights */}
        <section className="col-span-3 flex flex-col min-h-0 gap-6">
          <div className="flex-[3] min-h-0">
            <Calendar />
          </div>
          <div className="flex-[2] min-h-0">
            <DailyInsights />
          </div>
        </section>
      </div>

      <FooterTicker />
    </main>
  );
}
