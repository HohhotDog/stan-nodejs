import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('src/client');
const outDir = path.resolve('dist/client');
fs.mkdirSync(outDir, { recursive: true });
for (const file of ['index.html', 'logo.svg', 'styles.css']) {
  fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
}
console.log('Copied client assets to dist/client');
