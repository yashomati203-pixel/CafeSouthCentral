import { logger } from '../lib/logger';

/**
 * WhatsApp Business API Service (Mock Mode)
 */

interface WhatsAppTemplateParams {
    name: string; // Template name
    language: string;
    components: any[];
}

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = 'v18.0';

/**
 * Sends a WhatsApp message using Meta's Cloud API.
 * Defaults to Mock mode if credentials are missing.
 */
export async function sendWhatsAppMessage(to: string, template: WhatsAppTemplateParams) {
    const isMock = !WHATSAPP_ACCESS_TOKEN || !PHONE_NUMBER_ID;

    if (isMock) {
        logger.info(`[WhatsApp MOCK] Sending template "${template.name}" to ${to}`);
        logger.info(`[WhatsApp MOCK] Components: ${JSON.stringify(template.components, null, 2)}`);
        return { success: true, messageId: `mock_${Date.now()}` };
    }

    try {
        const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: to.startsWith('+') ? to : `+91${to}`, // Default to India if no prefix
                type: 'template',
                template: template
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            logger.error(`[WhatsApp API Error] ${JSON.stringify(data)}`);
            return { success: false, error: data.error?.message || 'Failed to send message' };
        }

        return { success: true, messageId: data.messages?.[0]?.id };
    } catch (error) {
        logger.error(`[WhatsApp Service Exception] ${error}`);
        return { success: false, error: 'Internal Service Error' };
    }
}

/**
 * High-level notification helpers
 */

export const whatsappNotifications = {
    /**
     * Sent when an order is confirmed (Payment success)
     */
    sendOrderConfirmation: async (phone: string, customerName: string, orderId: string, amount: number) => {
        return sendWhatsAppMessage(phone, {
            name: 'order_confirmation',
            language: 'en_US',
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: customerName },
                        { type: 'text', text: orderId },
                        { type: 'text', text: `₹${amount}` }
                    ]
                }
            ]
        });
    },

    /**
     * Sent when the order is marked as READY by the kitchen
     */
    sendOrderReady: async (phone: string, customerName: string, orderId: string) => {
        return sendWhatsAppMessage(phone, {
            name: 'order_ready',
            language: 'en_US',
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: customerName },
                        { type: 'text', text: orderId }
                    ]
                }
            ]
        });
    },

    /**
     * Sent on subscription activation
     */
    sendSubscriptionWelcome: async (phone: string, customerName: string, planName: string) => {
        return sendWhatsAppMessage(phone, {
            name: 'subscription_welcome',
            language: 'en_US',
            components: [
                {
                    type: 'body',
                    parameters: [
                        { type: 'text', text: customerName },
                        { type: 'text', text: planName }
                    ]
                }
            ]
        });
    }
};
