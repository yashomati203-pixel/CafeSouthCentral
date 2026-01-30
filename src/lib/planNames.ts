// Utility functions for subscription plan display names and formatting

export function getPlanDisplayName(planType: string): string {
    const planNameMap: Record<string, string> = {
        'MONTHLY_MESS': 'Ultimate Plan',
        'LIGHT_BITE': 'Light Bite Pass',
        'FEAST_FUEL': 'Feast & Fuel',
        'TOTAL_WELLNESS': 'Total Wellness',
        'HOT_SIPS_SNACKS': 'Hot Sips + SnacknMunch',
        'TRIAL': '1-Week Trial',
        // Legacy/alternative names
        'ultimate': 'Ultimate Plan',
        'light': 'Light Bite Pass',
        'feast': 'Feast & Fuel',
        'wellness': 'Total Wellness',
        'addon': 'Hot Sips + SnacknMunch',
        'trial': '1-Week Trial'
    };

    return planNameMap[planType] || planType;
}

interface SubscriptionStatus {
    title: string;
    message: string;
    color: string;
    bgColor: string;
    icon: string;
    borderColor: string;
}

export function getSubscriptionStatus(
    daysRemaining: number,
    planName: string,
    validUntilDate: Date,
    mealsRemaining?: number
): SubscriptionStatus {
    const formatDate = validUntilDate.toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    if (daysRemaining <= 0) {
        return {
            title: 'Plan Expired',
            message: `Your ${planName} has expired. Renew from here →`,
            color: '#ef4444',
            bgColor: '#fee2e2',
            borderColor: '#ef4444',
            icon: '⚠️'
        };
    } else if (daysRemaining <= 7) {
        const mealsText = mealsRemaining ? ` ${mealsRemaining} meals remaining.` : '';
        return {
            title: 'Expiring Soon',
            message: `Your ${planName} expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.${mealsText}`,
            color: '#f59e0b',
            bgColor: '#fef3c7',
            borderColor: '#f59e0b',
            icon: '⏰'
        };
    } else {
        const mealsText = mealsRemaining ? ` ${mealsRemaining} meals remaining.` : '';
        return {
            title: 'Active Member Status',
            message: `Your ${planName} is active. Next billing on ${formatDate}.${mealsText}`,
            color: '#10b981',
            bgColor: '#dcfce7',
            borderColor: '#10b981',
            icon: '🛡️'
        };
    }
}
