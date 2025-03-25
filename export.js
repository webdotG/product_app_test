const fs = require('fs-extra');
const path = require('path');

async function exportApp() {
  const outDir = path.join(__dirname, 'out');
  const nextDir = path.join(__dirname, '.next');
  
  await fs.emptyDir(outDir);
  await fs.copy(path.join(nextDir, 'standalone'), outDir);
  await fs.copy(path.join(nextDir, 'static'), path.join(outDir, '_next/static'));
  await fs.copy('public', outDir);
}

exportApp().catch(console.error);