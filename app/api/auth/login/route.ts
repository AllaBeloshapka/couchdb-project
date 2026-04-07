import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import * as jose from 'jose'; // Библиотека для работы с токенами
import dbClient from '@/lib/couchdb'; // Твой файл подключения к базе

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 1. Подключаемся к базе 'users'
        const db = dbClient.use('users');

        // 2. Ищем пользователя по email (так как email у нас это _id)
        // В CouchDB метод .get() ищет именно по полю _id
        const user: any = await db.get(email);

        if (!user) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
        }

        // 3. Сравниваем введенный пароль с тем, что лежит в базе (хешем)
        const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordMatch) {
            return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
        }

        // 4. Если всё ок — создаем JWT-токен (пропуск)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jose.SignJWT({ 
            email: user.email, 
            id: user._id 
        })
            .setProtectedHeader({ alg: 'HS256' }) // Алгоритм шифрования
            .setIssuedAt() // Дата создания
            .setExpirationTime('2h') // Срок действия (2 часа)
            .sign(secret); // Подписываем нашим секретом

        // 5. Возвращаем токен клиенту
        return NextResponse.json({ 
            message: 'Вход выполнен успешно',
            token: token 
        }, { status: 200 });

    } catch (error: any) {
        // Если база не нашла документ, она выкинет ошибку 404
        if (error.statusCode === 404) {
            return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
        }

        console.error('Ошибка входа:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}