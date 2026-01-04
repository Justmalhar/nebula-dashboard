import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    const appId = req.nextUrl.searchParams.get('appId');
    if (!appId) return new NextResponse('Missing appId', { status: 400 });

    try {
        // Find app path
        let appPath = '';
        try {
            appPath = execSync(`osascript -e 'get POSIX path of (path to application id "${appId}")'`).toString().trim();
        } catch (e) {
            // Fallback for system processes or apps that can't be found this way
            if (appId.includes('whatsapp')) appPath = '/Applications/WhatsApp.app';
            else if (appId.includes('chrome')) appPath = '/Applications/Google Chrome.app';
            else return new NextResponse('App not found', { status: 404 });
        }

        const resourcesPath = path.join(appPath, 'Contents', 'Resources');
        const infoPlistPath = path.join(appPath, 'Contents', 'Info.plist');

        let iconName = 'AppIcon.icns';
        if (fs.existsSync(infoPlistPath)) {
            const infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
            const match = infoPlist.match(/<key>CFBundleIconFile<\/key>\s*<string>([^<]*)<\/string>/i);
            if (match) {
                iconName = match[1];
                if (!iconName.endsWith('.icns')) iconName += '.icns';
            }
        }

        const iconPath = path.join(resourcesPath, iconName);
        if (!fs.existsSync(iconPath)) {
            return new NextResponse('Icon not found', { status: 404 });
        }

        const tempPngPath = `/tmp/${appId}_${Date.now()}.png`;
        execSync(`sips -s format png "${iconPath}" --out "${tempPngPath}" --resampleWidth 64`);

        const imageBuffer = fs.readFileSync(tempPngPath);
        fs.unlinkSync(tempPngPath);

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error fetching icon:', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
