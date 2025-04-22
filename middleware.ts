import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

const protectedRoutes = ['/dashboard', '/tasks', '/logs'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        !protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJwt(token);

    if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}
