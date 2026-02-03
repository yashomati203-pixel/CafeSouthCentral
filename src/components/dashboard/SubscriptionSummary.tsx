import styles from './SubscriptionSummary.module.css';

interface SubscriptionSummaryProps {
    dailyLimit?: number;
    itemsRedeemedToday: number; // 0 to 4
    creditsTotal: number;
    creditsUsed: number;
    validUntil: Date;
}

export default function SubscriptionSummary({
    dailyLimit = 4,
    itemsRedeemedToday,
    creditsTotal,
    creditsUsed,
    validUntil
}: SubscriptionSummaryProps) {

    const remainingDaily = dailyLimit - itemsRedeemedToday;
    const remainingMonthly = creditsTotal - creditsUsed;

    // Generate boxes for visual indicator
    // If itemsRedeemedToday = 1, then box 1 is filled (red/unavailable), others valid (green).
    // OR usually filled means "used". Specification says "Daily Allowance Indicator".
    // Let's make "Used" boxes filled/dimmed and "Available" boxes bright/highlighted.

    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h3 className={styles.title}>Your Meal Plan</h3>
                <span className={styles.validity}>
                    Valid until {validUntil.toLocaleDateString('en-IN')}
                </span>
            </header>

            <div className={styles.statsGrid}>
                {/* Daily Allowance Section Removed by Request
                <div className={styles.dailySection}>
                   ...
                </div>
                */}

                {/* Monthly Quota Section */}
                <div className={styles.quotaSection}>
                    <div className={styles.circleWidget}>
                        <svg viewBox="0 0 36 36" className={styles.circularChart}>
                            <path className={styles.circleBg}
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path className={styles.circleLine}
                                strokeDasharray={`${(remainingMonthly / creditsTotal) * 100}, 100`}
                                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className={styles.circleContent}>
                            <span className={styles.bigNumber}>{remainingMonthly}</span>
                            <span className={styles.unit}>Meals Left</span>
                        </div>
                    </div>
                    <div className={styles.quotaDetails}>
                        <span className={styles.quotaLabel}>Monthly Quota</span>
                        <span className={styles.quotaValue}>{creditsUsed} / {creditsTotal} Used</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
