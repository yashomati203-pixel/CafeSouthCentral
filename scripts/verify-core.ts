
import { prisma } from '@/lib/prisma';
import { inventoryService } from '@/services/inventoryService';
import { subscriptionService } from '@/services/subscriptionService';
import { authService } from '@/services/authService';
import { UserRole, PlanType } from '@prisma/client';

async function main() {
    console.log('🚀 Starting Core System Verification...');

    try {
        // 1. Setup Test Data
        console.log('\n📦 Setting up Test Data...');
        const testUserPhone = '9999999999';
        await prisma.user.deleteMany({ where: { phone: testUserPhone } }); // Cleanup
        await prisma.menuItem.deleteMany({ where: { name: 'Test Dosa' } });

        const customer = await prisma.user.create({
            data: {
                name: 'Test Customer',
                phone: testUserPhone,
                role: 'CUSTOMER'
            }
        });

        const menuItem = await prisma.menuItem.create({
            data: {
                name: 'Test Dosa',
                price: 50,
                stock: 10,
                reservedStock: 0,
                category: 'SOUTH_INDIAN'
            }
        });
        console.log('✅ Test Data Created');

        // 2. Test Inventory Reservation (Layer 1)
        console.log('\n🛡️ Testing Inventory Reservation...');
        const reserve1 = await inventoryService.reserveStock(menuItem.id, 5);
        console.log(`Reservation 1 (5 items): ${reserve1.success ? '✅ Success' : '❌ Failed'}`);

        const reserve2 = await inventoryService.reserveStock(menuItem.id, 6); // Should fail (only 5 left effectively)
        console.log(`Reservation 2 (6 items - Expect Fail): ${!reserve2.success ? '✅ Correctly Failed' : '❌ Incorrectly Succeeded'}`);

        if (reserve1.success && !reserve2.success) {
            console.log('✅ Inventory Reservation Logic Verified');
        } else {
            console.error('❌ Inventory Logic Failed');
        }

        // 3. Test Subscription Quotas
        console.log('\n📅 Testing Subscription Service...');
        // Create Subscription
        await prisma.userSubscription.create({
            data: {
                userId: customer.id,
                planType: 'LIGHT_BITE',
                creditsTotal: 30,
                creditsUsed: 29, // 1 left
                dailyLimit: 2,
                dailyUsed: 0,
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                status: 'ACTIVE'
            }
        });

        const check1 = await subscriptionService.validateQuota(customer.id, 1);
        console.log(`Quota Check (1 item): ${check1.valid ? '✅ Allowed' : '❌ Denied'}`);

        const check2 = await subscriptionService.validateQuota(customer.id, 2);
        console.log(`Quota Check (2 items - Expect Fail [Monthly limit]): ${!check2.valid ? '✅ Correctly Denied' : '❌ Incorrectly Allowed'}`);

        if (check1.valid && !check2.valid) {
            console.log('✅ Subscription Quota Logic Verified');
        } else {
            console.error('❌ Subscription Logic Failed');
        }

        // 4. Test RBAC
        console.log('\n🔑 Testing Authorization (RBAC)...');

        try {
            authService.requirePermission('CUSTOMER', 'VIEW_PII');
            console.error('❌ Customer viewed PII (Security Failure)');
        } catch (e) {
            console.log('✅ Customer denied PII access');
        }

        try {
            authService.requirePermission('SUPER_ADMIN', 'VIEW_PII');
            console.log('✅ Super Admin allowed PII access');
        } catch (e) {
            console.error('❌ Super Admin denied PII access');
        }

        console.log('\n🎉 Verification Complete!');

    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
