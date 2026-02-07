import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export enum ErrorCode {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    AUTH_ERROR = 'AUTH_ERROR',
    FORBIDDEN = 'FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    PAYMENT_ERROR = 'PAYMENT_ERROR',
    RATE_LIMIT = 'RATE_LIMIT'
}

export class AppError extends Error {
    public code: ErrorCode;
    public statusCode: number;
    public context?: any;

    constructor(code: ErrorCode, message: string, statusCode: number = 500, context?: any) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export async function handleError(error: unknown, req?: Request) {
    console.error('[ErrorHandler] Caught error:', error);

    let statusCode = 500;
    let message = 'Internal Server Error';
    let code = ErrorCode.INTERNAL_ERROR;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        code = error.code;
    } else if (error instanceof Error) {
        message = error.message;
    }

    // Persist to DB (Asynchronous - don't await blocking response)
    const errorLogPromise = prisma.errorLog.create({
        data: {
            code,
            message,
            stack: error instanceof Error ? error.stack : undefined,
            context: req ? JSON.stringify({
                url: req.url,
                method: req.method,
                // body: await req.clone().text() // CAUTION: Reading body might consume stream
            }) : undefined
        }
    }).catch(e => console.error('Failed to log error to DB:', e));

    return NextResponse.json(
        { error: message, code },
        { status: statusCode }
    );
}

export function createError(code: ErrorCode, message: string, statusCode: number = 400) {
    throw new AppError(code, message, statusCode);
}
