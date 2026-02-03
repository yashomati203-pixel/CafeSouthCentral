import { UserRole } from '@prisma/client';

/**
 * Authorization Service (RBAC)
 * Implements Permission Matrix from PRD
 */
export const authService = {
    /**
     * Check if role has access to specific action
     */
    can(role: UserRole, action: 'VIEW_ORDERS' | 'CANCEL_ORDERS' | 'EDIT_INVENTORY' | 'VIEW_PII' | 'DOWNLOAD_REPORTS'): boolean {
        if (role === 'SUPER_ADMIN') return true; // Super Admin can do everything

        switch (action) {
            case 'VIEW_ORDERS':
                return ['MANAGER', 'KITCHEN_STAFF'].includes(role);

            case 'CANCEL_ORDERS':
                return ['MANAGER'].includes(role);

            case 'EDIT_INVENTORY':
                return ['MANAGER'].includes(role);

            case 'DOWNLOAD_REPORTS':
                return ['MANAGER'].includes(role);

            case 'VIEW_PII':
                return false; // Only Super Admin

            default:
                return false;
        }
    },

    /**
     * Validate Role Access Helper
     * Throws error if not allowed
     */
    requirePermission(role: UserRole, action: 'VIEW_ORDERS' | 'CANCEL_ORDERS' | 'EDIT_INVENTORY' | 'VIEW_PII' | 'DOWNLOAD_REPORTS') {
        if (!this.can(role, action)) {
            throw new Error(`Access Denied: Role ${role} cannot perform ${action}`);
        }
    },

    /**
     * Get Rate Limit Configuration based on Role
     */
    getRateLimitConfig(role: UserRole) {
        switch (role) {
            case 'SUPER_ADMIN':
            case 'MANAGER':
                return { limit: 1000, windowMs: 60 * 1000 };
            case 'CUSTOMER':
                return { limit: 500, windowMs: 60 * 1000 };
            default:
                return { limit: 100, windowMs: 60 * 1000 }; // Public/Guest
        }
    }
};
