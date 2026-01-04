import { NextResponse } from 'next/server';
import { getNowPlaying, pauseTrack, playTrack, nextTrack, previousTrack } from '@/lib/spotify';

export async function GET() {
    try {
        const data = await getNowPlaying();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Spotify Local API Error:', error);
        return NextResponse.json({ isPlaying: false, error: 'Failed to fetch local Spotify status' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { action } = await request.json();

        switch (action) {
            case 'play':
                await playTrack();
                break;
            case 'pause':
                await pauseTrack();
                break;
            case 'next':
                await nextTrack();
                break;
            case 'previous':
                await previousTrack();
                break;
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Spotify Local Action Error:', error);
        return NextResponse.json({ error: 'Failed to perform local Spotify action' }, { status: 500 });
    }
}
