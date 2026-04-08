import { NextResponse } from 'next/server';
import dbClient from '@/lib/couchdb';
import bcrypt from 'bcrypt';

// Описываем, как выглядит наш юзер, чтобы TypeScript не ругался
interface UserDocument {
    _id: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        // Выбираем базу 'users'
        const db = dbClient.use('users');

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем объект пользователя строго по правилам
        const newUser: UserDocument = {
            _id: email, // ID в CouchDB будет равен почте
            email: email,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // Вставляем в базу
        await db.insert(newUser as any); 

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}