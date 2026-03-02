import { PrismaClient, MenuItemType } from '@prisma/client';

// Mock data definitions
const MOCK_USERS = [
    { id: 'user-1', name: 'Demo User', phone: '9876543210', role: 'CUSTOMER', createdAt: new Date() },
    { id: 'admin-1', name: 'Admin', phone: '1234567890', role: 'SUPER_ADMIN', createdAt: new Date() }
];

const MOCK_MENU = [
    { id: '1', name: 'Idli', description: 'Steamed rice cakes (2 pcs)', price: 49, type: MenuItemType.BOTH, category: 'South Indian', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '8', name: 'Plain Dosa', description: 'Crispy savory crepe', price: 59, type: MenuItemType.BOTH, category: 'Dosa', isVeg: true, isAvailable: true, stock: 50, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' },
    { id: '20', name: 'Filter Coffee', description: 'Classic South Indian coffee', price: 29, type: MenuItemType.BOTH, category: 'Beverages', isVeg: true, isAvailable: true, stock: 100, reservedStock: 0, isSubscriptionEligible: true, createdAt: new Date(), updatedAt: new Date(), imageUrl: '' }
];

const MOCK_ORDERS = [
    {
        id: 'ord-123',
        userId: 'user-1',
        status: 'PREPARING',
        totalAmount: 137,
        orderType: 'DINE_IN',
        paymentStatus: 'COMPLETED',
        createdAt: new Date(),
        items: [
            { id: 'item-1', menuItemId: '1', quantity: 2, price: 49 },
            { id: 'item-2', menuItemId: '20', quantity: 1, price: 29 }
        ]
    }
];

const MOCK_ANALYTICS = {
    revenue: 5240,
    orders: 45,
    customers: 22,
    popularItems: [{ name: 'Idli', count: 18 }, { name: 'Dosa', count: 12 }]
};

// Create a proxy that intercepts calls to the Prisma client
export const createMockPrismaClient = () => {
    const handler = {
        get(target: any, prop: string) {
            // Intercept model specific calls
            if (prop === 'user') {
                return {
                    findUnique: async () => MOCK_USERS[0],
                    findFirst: async () => MOCK_USERS[0],
                    findMany: async () => MOCK_USERS,
                    create: async (data: any) => ({ ...data.data, id: 'new-user', createdAt: new Date() }),
                    update: async (data: any) => ({ ...MOCK_USERS[0], ...data.data }),
                    count: async () => MOCK_USERS.length
                };
            }
            if (prop === 'menuItem') {
                return {
                    findUnique: async () => MOCK_MENU[0],
                    findFirst: async () => MOCK_MENU[0],
                    findMany: async () => MOCK_MENU,
                    create: async (data: any) => ({ ...data.data, id: 'new-item', createdAt: new Date() }),
                    update: async (data: any) => ({ ...MOCK_MENU[0], ...data.data }),
                    count: async () => MOCK_MENU.length
                };
            }
            if (prop === 'order') {
                return {
                    findUnique: async () => MOCK_ORDERS[0],
                    findFirst: async () => MOCK_ORDERS[0],
                    findMany: async () => MOCK_ORDERS,
                    create: async (data: any) => ({ ...data.data, id: 'new-order', createdAt: new Date() }),
                    update: async (data: any) => ({ ...MOCK_ORDERS[0], ...data.data }),
                    count: async () => MOCK_ORDERS.length
                };
            }

            // Intercept other methods or models using a generic fallback
            return new Proxy({}, {
                get(t: any, method: string) {
                    if (['findMany', 'findUnique', 'findFirst', 'create', 'update', 'delete', 'count'].includes(method)) {
                        return async () => method === 'count' ? 0 : method === 'findMany' ? [] : null;
                    }
                    return undefined;
                }
            });
        }
    };

    return new Proxy({}, handler) as PrismaClient;
};
