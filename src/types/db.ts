import { MenuItem, User, UserSubscription, DailyUsage, Order, OrderItem, UserRole, MenuItemType, PlanType, OrderStatus, OrderMode } from '@prisma/client';

export { UserRole, MenuItemType, PlanType, OrderStatus, OrderMode };
export type { MenuItem, User, UserSubscription, DailyUsage, Order, OrderItem };

// Ensure backwards compatibility if needed, or alias where names differ.
// Previous: export interface MenuItem { ... }
// Prisma: export type MenuItem = { ... }

// If we need to extend or pick specific fields for frontend that might be optional:
// For now, direct export usually works if fields align.
