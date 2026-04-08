import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    // Если пользователь пытается зайти в кабинет, но у него нет токена
    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/api/auth/login', request.url)); 
        // Пока отправим на API, так как страницы логина у нас еще нет
    }

    try {
        if (token && request.nextUrl.pathname.startsWith('/dashboard')) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            await jose.jwtVerify(token, secret);
            return NextResponse.next();
        }
    } catch (error) {
        return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }

    return NextResponse.next();
}

// Защищаем только папку dashboard
export const config = {
    matcher: ['/dashboard/:path*'],
};