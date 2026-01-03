import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('token')?.value;

        if (!token) {

            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            const secretStr = process.env.JWT_SECRET;
            if (!secretStr) {
                console.error("Middleware: JWT_SECRET is not defined");
                return NextResponse.redirect(new URL('/', request.url));
            }
            const secret = new TextEncoder().encode(secretStr);
            const { payload } = await jwtVerify(token, secret);

            // Check for 'admin' flag/role
            if (payload.role !== 'ADMIN') {

                return NextResponse.redirect(new URL('/', request.url));
            }

            // Authorized
            return NextResponse.next();

        } catch (err) {
            console.error("Middleware: Token verification failed.", err);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
