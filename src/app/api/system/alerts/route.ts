import { NextResponse } from 'next/server';

// Simple in-memory storage for V1 (reset on server restart is acceptable for now)
let activeAlert = {
    type: 'NONE', // HIGH_DEMAND, WEATHER, EVENT, NONE
    message: '',
    active: false
};

export async function GET() {
    return NextResponse.json(activeAlert);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        activeAlert = {
            type: body.type || 'NONE',
            message: body.message || '',
            active: body.active || false
        };
        return NextResponse.json({ success: true, alert: activeAlert });
    } catch (e) {
        return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
    }
}
