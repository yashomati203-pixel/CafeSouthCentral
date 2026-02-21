const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const content = fs.readFileSync(envPath, 'utf8');

const lines = content.split(/\r?\n/);
lines.forEach((l, i) => console.log(`Line ${i}:`, l));
const validLines = lines.filter(line => {
    // Keep comments and valid Supabase URL
    if (line.trim().startsWith('#')) return true;
    if (line.trim() === '') return true;
    // Filter out localhost placeholder
    if (line.includes('localhost:5432/mydb')) return false;
    // Keep Supabase or others
    return true;
});

const newContent = validLines.join('\n');
console.log('Original Lines:', lines.length);
console.log('New Lines:', validLines.length);

if (lines.length !== validLines.length) {
    fs.writeFileSync(envPath, newContent);
    console.log('Cleaned .env file.');
} else {
    console.log('No changes needed.');
}
