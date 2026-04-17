import { NextResponse } from 'next/server';
import dbClient from '@/lib/couchdb';
import bcrypt from 'bcrypt';

/**
 * Interface defining the structure of the user document in CouchDB.
 */
interface UserDocument {
    _id: string;          // Using email as the primary key
    email: string;
    passwordHash: string; // Storing hashed password only
    createdAt: string;    // ISO timestamp
}

/**
 * Handles new user registration.
 */
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        
        // 1. Initialize connection to the 'users' database
        const db = dbClient.use('users');

        // 2. Hash the password with a salt round of 10 for security
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Construct the user object following the UserDocument interface
        const newUser: UserDocument = {
            _id: email, // Email serves as the unique document ID in CouchDB
            email: email,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // 4. Insert the new user record into the database
        await db.insert(newUser as any); 

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Return 500 if the database insertion fails (e.g., duplicate ID or connection issue)
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}