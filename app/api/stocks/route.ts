import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const tickersParam = searchParams.get('tickers') || process.env.NEXT_PUBLIC_STOCK_TICKERS || 'AAPL,MSFT,GOOGL,TSLA,NVDA,AMZN,META,NFLX,AMD,INTC';
    const tickers = tickersParam.split(',').map(t => t.trim().toUpperCase());

    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    try {
        const results = await Promise.all(tickers.map(async (ticker) => {
            try {
                // Using Yahoo Finance chart API (reverted from quote due to 401s)
                const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=5d`, {
                    headers: { 'User-Agent': userAgent }
                });
                const data = await res.json();

                const meta = data.chart?.result?.[0]?.meta;
                if (!meta) return null;

                const currentPrice = meta.regularMarketPrice;
                const previousClose = meta.previousClose || meta.chartPreviousClose;

                let change = 0;
                let changePercent = 0;

                if (currentPrice && previousClose) {
                    change = currentPrice - previousClose;
                    changePercent = (change / previousClose) * 100;
                }

                return {
                    ticker: meta.symbol,
                    name: meta.shortName || meta.longName || meta.symbol,
                    price: currentPrice ? currentPrice.toFixed(2) : "N/A",
                    change: change.toFixed(2),
                    changePercent: changePercent.toFixed(2),
                    isPositive: change >= 0,
                    currency: meta.currency
                };
            } catch (e) {
                console.error(`Error fetching stock ${ticker}:`, e);
                return null;
            }
        }));

        const filteredResults = results.filter(r => r !== null);

        return NextResponse.json({
            status: 'ok',
            items: filteredResults,
            lastSync: new Date().toISOString()
        });
    } catch (error) {
        console.error('Stocks fetch error:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to fetch stocks' }, { status: 500 });
    }
}
