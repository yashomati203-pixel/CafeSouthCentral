import { prisma } from '@/lib/prisma';
import { User, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';

export class AdminAuthService {
    private static ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long!!'; // Provide default for dev if missing

    /**
     * Encrypt generic text (for TOTP secret)
     */
    private static encrypt(text: string): string {
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag();

        // Format: iv:encrypted:tag
        return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
    }

    /**
     * Decrypt generic text
     */
    private static decrypt(emsg: string): string {
        const parts = emsg.split(':');
        if (parts.length !== 3) throw new Error('Invalid encrypted string format');

        const [ivHex, encryptedHex, tagHex] = parts;
        const key = crypto.scryptSync(this.ENCRYPTION_KEY, 'salt', 32);

        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            key,
            Buffer.from(ivHex, 'hex')
        );

        decipher.setAuthTag(Buffer.from(tagHex, 'hex'));

        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Register a new Admin (Internal use / CLI only)
     */
    static async registerAdmin(
        name: string,
        phone: string,
        email: string,
        password: string,
        role: UserRole = 'MANAGER'
    ) {
        // 1. Hash Password
        const passwordHash = await argon2.hash(password);

        // 2. Generate TOTP Secret
        const secret = speakeasy.generateSecret({
            name: `Cafe South Central (${role})`
        });

        // 3. Encrypt TOTP Secret
        const encryptedSecret = this.encrypt(secret.base32);

        // 4. Create User
        const admin = await prisma.user.create({
            data: {
                name,
                phone,
                email,
                passwordHash,
                totpSecret: encryptedSecret,
                role,
                totpEnabled: false // Enabled after first successful verify
            }
        });

        // 5. Generate QR Code
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        return { admin, qrCodeUrl, secret: secret.base32 };
    }

    /**
     * Step 1: Login with Password
     * Returns: '2FA_REQUIRED' and temporary session ID, or throws invalid credentials
     */
    static async loginStep1(phoneOrEmail: string, password: string) {
        console.log('[AuthService] loginStep1:', { phoneOrEmail });

        const admin = await prisma.user.findFirst({
            where: {
                OR: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
                role: { in: ['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'] }
            }
        });

        console.log('[AuthService] User Found:', admin ? { id: admin.id, role: admin.role, hasHash: !!admin.passwordHash } : 'NOT FOUND');

        if (!admin || !admin.passwordHash) {
            console.log('[AuthService] User not found or no hash');
            throw new Error('Invalid credentials');
        }

        const validPassword = await argon2.verify(admin.passwordHash, password);
        console.log('[AuthService] Password Verify:', validPassword);

        if (!validPassword) {
            console.log('[AuthService] Password invalid');
            throw new Error('Invalid credentials');
        }

        // Return partial session details needed for 2FA step
        return {
            userId: admin.id,
            require2FA: true,
            role: admin.role
        };
    }

    /**
     * Step 2: Verify TOTP
     */
    static async verify2FA(userId: string, token: string) {
        const admin = await prisma.user.findUnique({ where: { id: userId } });
        if (!admin || !admin.totpSecret) {
            throw new Error('Admin 2FA setup missing');
        }

        const secret = this.decrypt(admin.totpSecret);

        const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 1 // Allow 30sec drift
        });

        if (!verified) {
            throw new Error('Invalid 2FA Token');
        }

        // Enable 2FA if not already
        if (!admin.totpEnabled) {
            await prisma.user.update({
                where: { id: userId },
                data: { totpEnabled: true }
            });
        }

        // Create Admin Session
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

        await prisma.adminSession.create({
            data: {
                adminId: admin.id,
                sessionToken,
                expiresAt
            }
        });

        return { sessionToken, user: admin };
    }
}
