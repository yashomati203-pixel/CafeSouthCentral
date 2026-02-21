import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
    console.log('🧹 Starting cleanup of duplicate menu items...');

    const items = await prisma.menuItem.findMany();
    // Use an object instead of Map to avoid iteration issues in some TS configs
    const grouped: Record<string, typeof items> = {};

    // group by normalized name
    for (const item of items) {
        const key = item.name.trim().toLowerCase();
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(item);
    }

    let deletedCount = 0;

    for (const name in grouped) {
        const group = grouped[name];
        if (group.length > 1) {
            console.log(`Found duplicates for "${name}": ${group.length}`);

            const expectedSlug = name.replace(/[^a-z0-9]+/g, '-');

            // Sort: 
            // 1. Exact slug match
            // 2. String ID vs Numeric ID

            group.sort((a, b) => {
                if (a.id === expectedSlug) return -1;
                if (b.id === expectedSlug) return 1;
                if (a.id.length > b.id.length) return -1;
                if (b.id.length > a.id.length) return 1;
                return 0;
            });

            // Keep index 0
            const keep = group[0];
            const toDelete = group.slice(1);

            console.log(` Keeping: ${keep.id} (${keep.name})`);

            for (const item of toDelete) {
                console.log(` Deleting: ${item.id} (${item.name})`);
                try {
                    await prisma.menuItem.delete({ where: { id: item.id } });
                    deletedCount++;
                } catch (e) {
                    console.error(` Failed to delete ${item.id}:`, e);
                }
            }
        }
    }

    console.log(`✅ Cleanup complete. Deleted ${deletedCount} duplicates.`);
}

cleanup()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
