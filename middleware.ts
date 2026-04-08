import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

/**
 * Middleware for global request interception.
 * Primary role: Verify JWT authenticity for protected routes.
 */
export async function middleware(request: NextRequest) {
    // 1. Extract the 'auth_token' from the incoming request cookies
    const token = request.cookies.get('auth_token')?.value;
    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

    // 2. Access Control: If no token is found and user targets a protected route
    if (!token && isDashboardPage) {
        // Redirect to Login API (or login page) since the user is unauthenticated
        return NextResponse.redirect(new URL('/', request.url)); 
    }

    try {
        // 3. Security Verification: Validate the token for protected paths
        if (token && isDashboardPage) {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET);
            
            // Verifies the signature using the server secret and checks if the token is expired
            await jose.jwtVerify(token, secret);
            
            // If verification succeeds, allow the request to proceed
            return NextResponse.next();
        }
    } catch (error) {
        // 4. Fallback: If the token is invalid or tampered with, deny access
        console.error('Middleware JWT Verification Error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow all other non-protected requests to continue
    return NextResponse.next();
}

/**
 * Configuration for the middleware filter.
 * Defines which routes trigger the authentication check.
 */
export const config = {
    matcher: ['/dashboard/:path*'], // Applies to all routes within the /dashboard folder
};