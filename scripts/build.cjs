const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });
for (const name of ['index.html', 'LICENSE', 'NOTICE.md']) {
  fs.copyFileSync(path.join(root, name), path.join(out, name));
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log('Static site built in dist/');
