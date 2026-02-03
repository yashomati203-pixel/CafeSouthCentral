import pino from 'pino';

// Initialize Pino Logger
// In prod, log to stdout (JSON)
// In dev, usage with pino-pretty is common, but basic JSON is fine or simplified.
export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    base: { env: process.env.NODE_ENV },
    timestamp: pino.stdTimeFunctions.isoTime,
});

// Helper for consistent error logging
export function logError(context: string, error: unknown, metadata?: Record<string, any>) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error({
        context,
        message: errorMsg,
        stack,
        ...metadata
    });
}
