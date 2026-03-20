const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
    { from: /officialfusionshroombar\.com/g, to: 'officialfusionshroombars.com' },
    { from: /support@officialfusionshroombars\.com/g, to: 'order@officialfusionshroombars.com' }, // Just in case it was modified
    { from: /23563 Baxter Rd, Wildomar, CA, 92595/g, to: '6736 S Sherbourne Dr, Los Angeles, CA 90056, USA' },
    { from: /23563 Baxter Rd/g, to: '6736 S Sherbourne Dr' },
];

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json') || fullPath.endsWith('.js'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            for (const r of replacements) {
                if (content.match(r.from)) {
                    content = content.replace(r.from, r.to);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
console.log('Done.');
