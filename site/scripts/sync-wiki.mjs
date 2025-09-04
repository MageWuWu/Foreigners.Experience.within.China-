// site/scripts/sync-wiki.mjs
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import removeMd from 'remove-markdown';

const execAsync = promisify(exec);

async function syncWiki() {
  console.log('[sync-wiki] Cloning wiki...');
  const tmp = '/tmp/wiki';
  await execAsync(`rm -rf ${tmp} && git clone https://github.com/MageWuWu/Foreigners.Experience.within.China-.wiki.git ${tmp}`);
  console.log('[sync-wiki] Stripping markdown...');

  const srcFiles = await fs.readdir(tmp);
  const destDir = path.resolve('site/pages/docs');
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const file of srcFiles) {
    if (!file.endsWith('.md')) continue;
    const srcPath = path.join(tmp, file);
    const destPath = path.join(destDir, file);
    const md = await fs.readFile(srcPath, 'utf8');
    const text = removeMd(md, { useImgAltText: true, gfm: true });
    await fs.writeFile(destPath, text, 'utf8');
    console.log(` → ${file} processed`);
  }

  console.log('[sync-wiki] All markdown stripped and copied.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncWiki().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
