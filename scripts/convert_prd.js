const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../PRD_Final.md');
const outputFile = path.join(__dirname, '../PRD_Final.doc');

try {
    let markdown = fs.readFileSync(inputFile, 'utf8');

    // Basic Markdown to HTML conversion
    let htmlContent = markdown
        // Headers
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        // Bold
        .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
        // Italic
        .replace(/\*(.*)\*/gim, '<i>$1</i>')
        // Horizontal Rule
        .replace(/^---/gim, '<hr>')
        // Lists (Simple conversion: assumes single level for now)
        .replace(/^\s*-\s+(.*$)/gim, '<ul><li>$1</li></ul>')
        .replace(/<\/ul>\s*<ul>/gim, '') // Merge adjacent lists
        // Paragraphs (double newlines)
        .replace(/\n\n/gim, '<br><br>');

    // Full HTML structure for Word
    const docContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset="utf-8">
        <title>PRD Final</title>
        <style>
            body { font-family: 'Calibri', sans-serif; line-height: 1.5; }
            h1 { color: #5C3A1A; font-size: 24pt; }
            h2 { color: #5C3A1A; font-size: 18pt; margin-top: 15pt; }
            h3 { color: #D4AF37; font-size: 14pt; }
            b { color: #1f2937; }
        </style>
    </head>
    <body>
        ${htmlContent}
    </body>
    </html>
    `;

    fs.writeFileSync(outputFile, docContent);
    console.log('Successfully converted PRD_Final.md to PRD_Final.doc');

} catch (err) {
    console.error('Error converting file:', err);
    process.exit(1);
}
