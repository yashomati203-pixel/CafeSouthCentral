import { whatsappClient } from '@/lib/whatsapp';
import { logger } from '@/lib/logger';

// Template Mapping (You must create these in Meta Business Manager first!)
const TEMPLATES = {
    OTP: 'auth_otp',                // Expected Params: [OTP_CODE]
    ORDER_CONFIRM: 'order_status',   // Expected Params: [ORDER_ID, STATUS, ESTIMATED_TIME]
    ORDER_READY: 'order_ready'       // Expected Params: [ORDER_ID]
};

export const notificationService = {
    /**
     * Send Authentication OTP via WhatsApp
     */
    async sendOTP(phone: string, otp: string) {
        try {
            // Note: WhatsApp requires strictly formatted numbers (usually Country Code + Number)
            // Ensure phone has '91' prefix if Indian.
            const formattedPhone = phone.length === 10 ? '91' + phone : phone;

            await whatsappClient.sendTemplate(
                formattedPhone,
                TEMPLATES.OTP,
                [otp] // Body Param 1: {{1}}
            );
            return true;
        } catch (error) {
            logger.error({ err: error }, 'Failed to send WhatsApp OTP');
            // Fallback to SMS if critical? For now return false.
            return false;
        }
    },

    /**
     * Send Order Status Update
     */
    async sendOrderStatus(phone: string, orderId: string, status: string) {
        try {
            const formattedPhone = phone.length === 10 ? '91' + phone : phone;

            // Format status for deeper readability
            const readableStatus = status.replace('_', ' ');

            await whatsappClient.sendTemplate(
                formattedPhone,
                TEMPLATES.ORDER_CONFIRM,
                [orderId, readableStatus] // Order ID {{1}}, Status {{2}}
            );
            return true;
        } catch (error) {
            logger.error({ err: error }, 'Failed to send Order Update');
            return false;
        }
    }
};
