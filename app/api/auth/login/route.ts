import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import dbClient from '@/lib/couchdb';

/**
 * API route for user authentication.
 * Verifies credentials and sets a secure JWT cookie.
 */
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const db = dbClient.use('users');

        // 1. Fetch user from CouchDB using email as the document ID
        const user: any = await db.get(email);

        // 2. Compare the provided plain-text password with the stored hash
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatch) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // 3. Generate a Signed JWT (JSON Web Token)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ 
            email: user.email, 
            id: user._id 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h') // Token validity period
            .sign(secret);

        // 4. Create response object and attach the JWT as a secure cookie
        const response = NextResponse.json({ 
            message: 'Login successful' 
        }, { status: 200 });

        response.cookies.set('auth_token', token, {
            httpOnly: true, // Enhances security by preventing client-side JS access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Mitigates CSRF attacks
            maxAge: 60 * 60 * 2, // 2 hours in seconds
            path: '/',
        });

        // 5. Return the response with the set-cookie header
        return response;

    } catch (error: any) {
        // Handle database 404 error if user document doesn't exist
        if (error.statusCode === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}