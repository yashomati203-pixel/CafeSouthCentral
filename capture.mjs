import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } });
    const urls = [
        { path: '/', name: 'home' },
        { path: '/menu', name: 'menu' },
        { path: '/login', name: 'login' },
        { path: '/account', name: 'account' },
        { path: '/admin', name: 'admin' }
    ];

    const artifactDir = 'C:\\Users\\yasho\\.gemini\\antigravity\\brain\\2e39973e-8471-4bff-8bcf-5fbc645a1a1e';

    for (const { path, name } of urls) {
        try {
            console.log(`Navigating to ${path}...`);
            await page.goto(`http://localhost:3000${path}`, { waitUntil: 'networkidle', timeout: 30000 });
            // wait a bit for animations
            await page.waitForTimeout(2000);

            // scroll to bottom to trigger lazy loads
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(1000);
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(500);

            console.log(`Taking screenshot for ${name}...`);
            await page.screenshot({ path: `${artifactDir}\\${name}.png`, fullPage: true });
        } catch (e) {
            console.error(e);
        }
    }

    await browser.close();
})();
