'use client';

import { Dispatch, SetStateAction } from 'react';
import styles from './ModeToggle.module.css';

interface ModeToggleProps {
    mode: 'NORMAL' | 'SUBSCRIPTION';
    setMode: Dispatch<SetStateAction<'NORMAL' | 'SUBSCRIPTION'>>;
}

export default function ModeToggle({ mode, setMode }: ModeToggleProps) {
    const isSubscription = mode === 'SUBSCRIPTION';

    return (
        <div className={styles.container}>
            <span className={`${styles.label} ${!isSubscription ? styles.active : ''}`}>
                Normal
            </span>

            <div
                className={styles.switch}
                onClick={() => setMode(isSubscription ? 'NORMAL' : 'SUBSCRIPTION')}
                role="button"
                tabIndex={0}
            >
                <div className={`${styles.slider} ${isSubscription ? styles.slideRight : ''}`} />
            </div>

            <span className={`${styles.label} ${isSubscription ? styles.active : ''}`}>
                Subscription
            </span>
        </div>
    );
}
