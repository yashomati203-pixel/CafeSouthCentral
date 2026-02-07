import { logger } from './logger';

const WHATSAPP_API_URL = 'https://graph.facebook.com/v19.0'; // Check for latest version
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

interface TemplateParameter {
    type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
    text?: string;
    currency?: {
        fallback_value: string;
        code: string;
        amount_1000: number;
    };
    date_time?: {
        fallback_value: string;
    };
    image?: {
        link: string;
    };
}

interface WhatsAppMessage {
    messaging_product: 'whatsapp';
    to: string;
    type: 'template';
    template: {
        name: string;
        language: {
            code: string;
        };
        components: {
            type: 'header' | 'body' | 'footer';
            parameters: TemplateParameter[];
        }[];
    };
}

export const whatsappClient = {
    /**
     * Send a Template Message
     * @param to Recipient Phone Number (e.g., '919876543210')
     * @param templateName Meta Template Name (e.g., 'auth_otp', 'order_confirm')
     * @param params Array of text parameters for the Body component
     * @param languageCode Default 'en_US'
     */
    async sendTemplate(
        to: string,
        templateName: string,
        params: string[],
        languageCode: string = 'en_US'
    ) {
        if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
            logger.warn({ to, templateName, params }, 'WhatsApp Config Missing. Message logged only.');
            // In Dev/Mock mode, just log it.
            return { message_id: 'mock_wa_' + Date.now() };
        }

        const payload: WhatsAppMessage = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: { code: languageCode },
                components: [
                    {
                        type: 'body',
                        parameters: params.map(text => ({ type: 'text', text }))
                    }
                ]
            }
        };

        try {
            const res = await fetch(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                logger.error({ data }, 'WhatsApp API Error');
                throw new Error(data.error?.message || 'Failed to send WhatsApp message');
            }

            return data;
        } catch (error) {
            logger.error({ err: error }, 'WhatsApp Network Error');
            // Don't crash the app, return null or false logic upstream
            throw error;
        }
    }
};
