import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const rssUrl = searchParams.get('url');

    if (!rssUrl) {
        return NextResponse.json({ status: 'error', message: 'Missing RSS URL' }, { status: 400 });
    }

    const apiKey = process.env.RSS2JSON_API_KEY;
    if (!apiKey) {
        console.error('RSS2JSON_API_KEY is not defined');
    }

    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}${apiKey ? `&api_key=${apiKey}` : ''}&count=50`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('News fetch error:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to fetch news' }, { status: 500 });
    }
}
