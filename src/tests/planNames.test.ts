import { describe, it, expect } from 'vitest';
import { getSubscriptionStatus, getPlanDisplayName } from '../lib/planNames';

describe('Plan Names Utility', () => {
    it('should return correct display name for plan types', () => {
        expect(getPlanDisplayName('LIGHT_BITE')).toBe('Light Bite Pass');
        expect(getPlanDisplayName('unknown')).toBe('unknown');
    });
});

describe('Subscription Status Logic', () => {
    it('should return Expired status when daysRemaining <= 0', () => {
        const status = getSubscriptionStatus(0, 'Test Plan', new Date());
        expect(status.title).toBe('Plan Expired');
        expect(status.color).toBe('#ef4444');
    });

    it('should return Expiring Soon status when daysRemaining <= 7', () => {
        const status = getSubscriptionStatus(5, 'Test Plan', new Date());
        expect(status.title).toBe('Expiring Soon');
        expect(status.color).toBe('#f59e0b');
    });

    it('should return Active status when daysRemaining > 7', () => {
        const status = getSubscriptionStatus(10, 'Test Plan', new Date());
        expect(status.title).toBe('Active Member Status');
        expect(status.color).toBe('#10b981');
    });
});
