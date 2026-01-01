import { NextResponse } from 'next/server';
import { OpenRouter } from '@openrouter/sdk';

// Initialize OpenRouter with environment variables
const openRouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Simple in-memory cache
let cachedInsights: {
    word: string;
    definition: string;
    quote: string;
    author: string;
    timestamp: number;
} | null = null;

const CACHE_DURATION = 60 * 10 * 1000; // 10 minutes

export async function GET() {
    const now = Date.now();

    if (cachedInsights && now - cachedInsights.timestamp < CACHE_DURATION) {
        return NextResponse.json(cachedInsights);
    }

    try {
        const prompt = `You are a zen and wisdom generator for a tech-focused dashboard. 
Generate two things:
1. A single word (max 12 chars) with a short, profound definition (max 100 chars).
2. A short, impactful quote (max 120 chars) with its author.

The tone should be "Neural/Cybernetic Wisdom". Prefer concepts related to japanese philosophy, hindu mythology & philosophy, growth, focus, technology, productivity, mindfulness, and philosophy.

Format the output EXACTLY as JSON:
{
  "word": "KAIZEN",
  "definition": "Continuous improvement through small, incremental changes.",
  "quote": "The quieter you become, the more you are able to hear.",
  "author": "Rumi"
}`;

        const completion = await openRouter.chat.send({
            model: process.env.OPENROUTER_MODEL,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            stream: false,
            responseFormat: { type: 'json_object' }
        });

        const choice = completion.choices[0];
        let content = '';

        if (typeof choice.message.content === 'string') {
            content = choice.message.content;
        } else if (Array.isArray(choice.message.content)) {
            const firstItem = choice.message.content[0];
            if (firstItem && 'text' in firstItem) {
                content = firstItem.text;
            }
        }

        if (!content) {
            throw new Error('Empty response from OpenRouter');
        }

        const parsed = JSON.parse(content);

        cachedInsights = {
            ...parsed,
            timestamp: now,
        };

        return NextResponse.json(cachedInsights);
    } catch (error) {
        console.error('OPENROUTER_ERROR:', error);

        // Fallback if API fails and no cache exists
        if (!cachedInsights) {
            return NextResponse.json({
                word: "RESILIENCE",
                definition: "The capacity to recover quickly from difficulties; toughness.",
                quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                author: "Winston Churchill",
                timestamp: now
            });
        }

        return NextResponse.json(cachedInsights);
    }
}
