import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const runAppleScript = async (script: string) => {
    try {
        const { stdout } = await execAsync(`osascript -e '${script}'`);
        return stdout.trim();
    } catch (error) {
        console.error('AppleScript Error:', error);
        return null;
    }
};

export const getNowPlaying = async () => {
    const script = `
        if application "Spotify" is running then
            tell application "Spotify"
                if player state is playing or player state is paused then
                    set track_name to name of current track
                    set track_artist to artist of current track
                    set track_album to album of current track
                    set track_url to spotify url of current track
                    set track_art to artwork url of current track
                    set track_duration to duration of current track
                    set track_position to player position
                    set player_state to player state as string
                    return track_name & "||" & track_artist & "||" & track_album & "||" & track_url & "||" & track_art & "||" & track_duration & "||" & track_position & "||" & player_state
                else
                    return "stopped"
                end if
            end tell
        else
            return "not_running"
        end if
    `;

    const result = await runAppleScript(script);

    if (!result || result === "stopped" || result === "not_running") {
        return { isPlaying: false, status: result };
    }

    const [title, artist, album, songUrl, albumImageUrl, durationMs, progressSec, playerState] = result.split("||");

    return {
        title,
        artist,
        album,
        songUrl,
        albumImageUrl,
        durationMs: parseInt(durationMs),
        progressMs: Math.round(parseFloat(progressSec) * 1000),
        isPlaying: playerState === "playing"
    };
};

export const pauseTrack = () => runAppleScript('tell application "Spotify" to pause');
export const playTrack = () => runAppleScript('tell application "Spotify" to play');
export const nextTrack = () => runAppleScript('tell application "Spotify" to next track');
export const previousTrack = () => runAppleScript('tell application "Spotify" to previous track');
