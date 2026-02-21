const fs = require('fs');
let content = fs.readFileSync('.env', 'utf8');
const newContent = content.replace(/"/g, '').replace(/'/g, '');
fs.writeFileSync('.env', newContent);
console.log('Cleaned quotes from .env');
