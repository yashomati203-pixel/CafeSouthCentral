import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

// Encryption helper (duplicated from service to be standalone)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long!!';

function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
}

async function createAdmin() {
    const name = 'Super Admin';
    const phone = '9999999999';
    const email = 'admin@cafe.com';
    const password = 'AdminPassword123!';
    const role: UserRole = UserRole.SUPER_ADMIN;

    console.log(`Creating Admin: ${name} (${phone})`);

    // 1. Hash Password
    const passwordHash = await argon2.hash(password);

    // 2. Generate TOTP Secret
    const secret = speakeasy.generateSecret({
        name: `Cafe South Central (${name})`
    });

    // 3. Encrypt Secret
    const encryptedSecret = encrypt(secret.base32);

    try {
        const admin = await prisma.user.upsert({
            where: { phone },
            update: {
                passwordHash,
                totpSecret: encryptedSecret,
                role,
                totpEnabled: false
            },
            create: {
                name,
                phone,
                email,
                passwordHash,
                totpSecret: encryptedSecret,
                role,
                totpEnabled: false
            }
        });

        // 4. Generate QR Code
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        console.log('\n✅ Admin User Created/Updated Successfully!');
        console.log('-------------------------------------------');
        console.log(`Login Phone: ${phone}`);
        console.log(`Password:    ${password}`);
        console.log('-------------------------------------------');
        console.log('⚠️  ACTION REQUIRED: SCAN THIS QR CODE FOR 2FA');
        // Print QR code to terminal/console? A bit hard.
        // Instead, print the Data URL and the Text Secret.
        console.log(`\nTOTP SECRET (Manual Entry): ${secret.base32}`);
        console.log(`\nScan this QR Code URL in browser to verify:`);
        console.log(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(secret.otpauth_url!)}`);
        console.log('\n(Copy-paste the above URL into a browser to see the QR code)');

    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
