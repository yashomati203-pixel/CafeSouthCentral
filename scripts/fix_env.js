const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
let content = fs.readFileSync(envPath, 'utf8');

// Fix specific typo: postgresql:postgresql:// -> postgresql://
if (content.includes('postgresql:postgresql://')) {
    content = content.replace('postgresql:postgresql://', 'postgresql://');
    fs.writeFileSync(envPath, content);
    console.log('Fixed duplicate protocol prefix.');
} else {
    console.log('No duplicate prefix found.');
}
