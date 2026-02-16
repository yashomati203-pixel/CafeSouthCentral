'use client';
import { useState, useEffect } from 'react';
import { AlertCircle, CloudRain, Clock, X } from 'lucide-react';

export default function SystemAlertBanner() {
    const [alert, setAlert] = useState<{ type: string; message: string; active: boolean } | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Fetch active alerts
        const fetchAlerts = async () => {
            try {
                const res = await fetch('/api/system/alerts');
                if (res.ok) {
                    const data = await res.json();
                    if (data.active) {
                        setAlert(data);
                        setVisible(true);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch alerts", e);
            }
        };

        fetchAlerts();

        // Poll every minute
        const interval = setInterval(fetchAlerts, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!visible || !alert) return null;

    const getIcon = () => {
        switch (alert.type) {
            case 'HIGH_DEMAND': return <Clock className="w-5 h-5" />;
            case 'WEATHER': return <CloudRain className="w-5 h-5" />;
            default: return <AlertCircle className="w-5 h-5" />;
        }
    };

    const getColor = () => {
        switch (alert.type) {
            case 'HIGH_DEMAND': return 'bg-orange-50 text-orange-800 border-orange-200';
            case 'WEATHER': return 'bg-blue-50 text-blue-800 border-blue-200';
            default: return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        }
    };

    return (
        <div className={`fixed top-0 left-0 right-0 z-[60] px-4 py-3 border-b flex items-center justify-between shadow-sm animate-in slide-in-from-top duration-300 ${getColor()}`}>
            <div className="flex items-center gap-3">
                {getIcon()}
                <p className="text-sm font-medium">{alert.message}</p>
            </div>
            <button
                onClick={() => setVisible(false)}
                className="p-1 hover:bg-black/5 rounded-full"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
