import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import dbClient from '@/lib/couchdb';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const db = dbClient.use('users');

        // 1. Ищем пользователя
        const user: any = await db.get(email);

        // 2. Проверяем пароль
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordMatch) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
        }

        // 3. Создаем токен (переменная token рождается здесь)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ 
            email: user.email, 
            id: user._id 
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret);

        // 4. Создаем ответ и ПРЯМО ТУТ устанавливаем куку
        const response = NextResponse.json({ 
            message: 'Login successful' 
        }, { status: 200 });

        response.cookies.set('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 2,
            path: '/',
        });

        // 5. Возвращаем готовый ответ с кукой
        return response;

    } catch (error: any) {
        if (error.statusCode === 404) {
            return NextResponse.json({ error: 'User not found' }, { status: 401 });
        }
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}