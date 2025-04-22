import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
    const expiredToken = serialize('token', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
    });

    const response = NextResponse.json({ message: 'Logged out' });
    response.headers.set('Set-Cookie', expiredToken);
    return response;
}
