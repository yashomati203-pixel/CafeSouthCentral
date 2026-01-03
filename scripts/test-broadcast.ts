import fetch from 'node-fetch';

async function testBroadcast() {
    try {
        const res = await fetch('http://localhost:3000/api/admin/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: "Test Notification",
                body: "This is a test from the script."
            })
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Response Body:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}
testBroadcast();
