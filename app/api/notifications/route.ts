import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const DB_PATH = path.join(process.env.HOME || '', 'Library/Group Containers/group.com.apple.usernoted/db2/db');

    if (!fs.existsSync(DB_PATH)) {
        return NextResponse.json({ error: 'Notification database not found' }, { status: 404 });
    }

    try {
        const query = `
            SELECT 
                app.identifier, 
                hex(record.data),
                record.delivered_date
            FROM record 
            JOIN app ON record.app_id = app.app_id 
            WHERE app.identifier != 'com.google.antigravity'
            ORDER BY record.delivered_date DESC 
            LIMIT 50;
        `;

        const output = execSync(`sqlite3 "${DB_PATH}" "${query}"`).toString();
        const rows = output.trim().split('\n');

        const results = [];
        const seen = new Set();

        for (const row of rows) {
            if (!row) continue;
            const delimiterIndex = row.indexOf('|');
            const lastDelimiterIndex = row.lastIndexOf('|');

            if (delimiterIndex === -1 || lastDelimiterIndex === -1 || delimiterIndex === lastDelimiterIndex) continue;

            const appId = row.substring(0, delimiterIndex);
            const hexData = row.substring(delimiterIndex + 1, lastDelimiterIndex);
            const deliveredDate = parseFloat(row.substring(lastDelimiterIndex + 1));

            const tempHexFile = `/tmp/notif_${Date.now()}_${Math.random().toString(36).substring(7)}.hex`;
            const tempPlistFile = tempHexFile.replace('.hex', '.plist');

            try {
                fs.writeFileSync(tempHexFile, hexData);
                execSync(`xxd -r -p "${tempHexFile}" "${tempPlistFile}"`);

                // Use XML conversion as it's more robust than JSON for binary-heavy plists
                const xmlStr = execSync(`plutil -convert xml1 -o - "${tempPlistFile}"`).toString();

                // Helper to extract values from XML - searching multiple possible keys
                const findValue = (keys: string[]) => {
                    for (const key of keys) {
                        const regex = new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`, 'i');
                        const match = xmlStr.match(regex);
                        if (match && match[1]) return match[1];
                    }
                    return '';
                };

                // Common keys for titles and bodies across different apps
                // 'titl'/'body' are standard UNNotificationRequest keys
                // 'title'/'message' are often used in other formats or nested plists
                const title = findValue(['titl', 'title', 'headline']);
                const body = findValue(['body', 'message', 'informativeText']);
                const subtitle = findValue(['subt', 'subtitle']);

                // Fallback: If still empty, WhatsApp often has title in <key>titl</key> but it might be differently nested
                // or use a different key for the actual message content.
                // Let's also look for any string that follows a known identifier key.

                if (title || body) {
                    // Clean up common XML entities
                    const clean = (s: string) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#10;/g, '\n');
                    const cleanTitle = clean(title) || 'System Notification';
                    const cleanBody = clean(body);

                    const dedupKey = `${appId}:${cleanTitle}:${cleanBody}`;
                    if (seen.has(dedupKey)) continue;
                    seen.add(dedupKey);

                    results.push({
                        appId,
                        title: cleanTitle,
                        subtitle: clean(subtitle),
                        body: cleanBody,
                        date: new Date((deliveredDate + 978307200) * 1000).toISOString()
                    });
                }
            } catch (e) {
                // Skip failed parses
            } finally {
                if (fs.existsSync(tempHexFile)) fs.unlinkSync(tempHexFile);
                if (fs.existsSync(tempPlistFile)) fs.unlinkSync(tempPlistFile);
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
