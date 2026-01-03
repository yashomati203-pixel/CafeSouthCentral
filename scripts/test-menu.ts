import fetch from 'node-fetch';

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/menu');
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text.substring(0, 500));
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}
test();
