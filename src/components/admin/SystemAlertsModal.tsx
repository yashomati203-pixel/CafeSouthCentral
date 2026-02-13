'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Package, Clock, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Alert {
    id: string;
    type: 'stock' | 'order_delay' | 'system';
    severity: 'critical' | 'warning' | 'info';
    title: string;
    message: string;
    actionUrl?: string;
    itemId?: string;
    createdAt: Date;
}

interface AlertCounts {
    total: number;
    critical: number;
    warning: number;
    stock: number;
    orderDelay: number;
}

interface SystemAlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SystemAlertsModal({ isOpen, onClose }: SystemAlertsModalProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [counts, setCounts] = useState<AlertCounts>({ total: 0, critical: 0, warning: 0, stock: 0, orderDelay: 0 });
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && mounted) {
            fetchAlerts();
            // Prevent scrolling on body when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, mounted]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/system-alerts');
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.alerts || []);
                setCounts(data.counts || { total: 0, critical: 0, warning: 0, stock: 0, orderDelay: 0 });
            }
        } catch (error) {
            console.error('Failed to fetch system alerts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'warning': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'info': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'stock': return <Package className="w-5 h-5" />;
            case 'order_delay': return <Clock className="w-5 h-5" />;
            default: return <AlertCircle className="w-5 h-5" />;
        }
    };

    const handleAlertAction = (actionUrl?: string) => {
        if (actionUrl) {
            onClose();
            router.push(actionUrl);
        }
    };

    if (!isOpen || !mounted) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 pt-24 overflow-y-auto"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden relative z-[10000]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6" />
                                System Alerts
                            </h3>
                            <p className="text-white/80 text-sm mt-1">Stock alerts, order delays, and operational warnings</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors flex items-center justify-center"
                            title="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-4 gap-3 mt-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{counts.total}</div>
                            <div className="text-xs text-white/70 uppercase">Total</div>
                        </div>
                        <div className="bg-red-500/30 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{counts.critical}</div>
                            <div className="text-xs text-white/70 uppercase">Critical</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{counts.stock}</div>
                            <div className="text-xs text-white/70 uppercase">Stock</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{counts.orderDelay}</div>
                            <div className="text-xs text-white/70 uppercase">Delays</div>
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="overflow-y-auto p-6 max-h-[calc(85vh-240px)]">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0e2a1a] mx-auto mb-4"></div>
                            Loading alerts...
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p className="font-bold text-lg">No Active Alerts</p>
                            <p className="text-sm">All systems operating normally</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-xl border-2 ${getSeverityColor(alert.severity)} transition-all hover:shadow-md`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            {getTypeIcon(alert.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="font-bold text-sm">{alert.title}</h4>
                                                    <p className="text-sm mt-1">{alert.message}</p>
                                                    <p className="text-xs opacity-70 mt-2">
                                                        {new Date(alert.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                                {alert.actionUrl && (
                                                    <button
                                                        onClick={() => handleAlertAction(alert.actionUrl)}
                                                        className="px-3 py-1.5 bg-white/50 hover:bg-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap"
                                                    >
                                                        View
                                                        <ExternalLink className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 p-4 bg-gray-50 flex justify-between items-center gap-4">
                    <p className="text-xs text-gray-500">Auto-refreshes every 30 seconds</p>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchAlerts}
                            className="px-4 py-2 bg-[#0e2a1a] text-white rounded-lg text-sm font-bold hover:bg-[#0e2a1a]/90 transition-colors"
                        >
                            Refresh Now
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
