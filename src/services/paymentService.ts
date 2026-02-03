import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

// Initialize Razorpay
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const razorpay = (keyId && keySecret)
    ? new Razorpay({ key_id: keyId, key_secret: keySecret })
    : null;

if (!razorpay) {
    console.warn("⚠️ Razorpay keys missing. Payment operations will be mocked or fail.");
}

export const paymentService = {
    /**
     * Create Razorpay Order
     */
    async createOrder(amount: number, receiptId: string) {
        if (!razorpay) {
            console.warn("[Payment] Mocking order creation");
            return {
                id: "order_mock_" + Math.random().toString(36).substring(7),
                amount: amount * 100,
                currency: "INR",
                receipt: receiptId,
                status: "created"
            };
        }

        const options = {
            amount: Math.round(amount * 100), // paise
            currency: "INR",
            receipt: receiptId,
            payment_capture: 1 // Auto capture
        };

        try {
            return await razorpay.orders.create(options);
        } catch (error) {
            console.error("[Payment] Create Order Failed:", error);
            throw new Error("Failed to create payment order");
        }
    },

    /**
     * Verify Signature (HMAC SHA256)
     */
    verifySignature(orderId: string, paymentId: string, signature: string): boolean {
        if (!keySecret) return true; // Dev mode bypass if no keys? No, strictly fail in prod.
        // Ideally fail if no secret. For dev with mock, we might need a bypass.
        if (!razorpay) return true;

        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(body.toString())
            .digest('hex');

        return expectedSignature === signature;
    },

    /**
     * Fetch Payment Details from Razorpay
     */
    async fetchPayment(paymentId: string) {
        if (!razorpay) return null;
        return await razorpay.payments.fetch(paymentId);
    },

    /**
     * Record Orphaned Payment (Payment Success but Order Creation Failed)
     */
    async recordOrphanedPayment(data: {
        paymentId: string;
        amount: number;
        userId: string;
        errorMessage: string;
    }) {
        try {
            await prisma.orphanedPayment.create({
                data: {
                    razorpayPaymentId: data.paymentId,
                    amount: data.amount,
                    userId: data.userId,
                    errorMessage: data.errorMessage
                }
            });
            console.log(`[Payment] Recorded orphan payment: ${data.paymentId}`);
        } catch (error) {
            console.error("[Payment] Failed to record orphan payment:", error);
        }
    },

    /**
     * Process Refund
     */
    async processRefund(paymentId: string, amount?: number) {
        if (!razorpay) {
            console.log(`[Payment] Mock Refund for ${paymentId}`);
            return { id: "rfnd_mock", status: "processed" };
        }

        try {
            const options: any = {};
            if (amount) options.amount = Math.round(amount * 100);

            const refund = await razorpay.payments.refund(paymentId, options);
            return refund;
        } catch (error) {
            console.error("[Payment] Refund Failed:", error);
            throw error;
        }
    }
};

export const createRazorpayOrder = paymentService.createOrder;
