import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    const cookie = serialize('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        // secure: process.env.NODE_ENV === 'production',
    });

    const response = NextResponse.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });

    response.headers.set('Set-Cookie', cookie);

    response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return response;
}
