import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

console.log("Testing Firebase Admin Connection...");
console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
console.log("Client Email:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("Private Key Length:", process.env.FIREBASE_PRIVATE_KEY?.length);

import * as fs from 'fs';

try {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle both actual newlines and escaped newlines
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    const msg = `✅ Success! Project: ${process.env.FIREBASE_PROJECT_ID}`;
    console.log(msg);
    fs.writeFileSync('test_result.txt', msg);
} catch (error) {
    const msg = `❌ Failed: ${(error as any).message}`;
    console.error(msg);
    fs.writeFileSync('test_result.txt', msg);
}
