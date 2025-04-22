import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

const protectedRoutes = ['/dashboard', '/tasks', '/logs'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        !protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.next();
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const payload = verifyJwt(token);
    if (!payload) {
        return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
        );
    }

    return NextResponse.next();
}
