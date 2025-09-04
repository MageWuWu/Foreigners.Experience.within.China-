import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import removeMd from 'remove-markdown';

const execAsync = promisify(exec);

async function syncWiki() {
  console.log('[sync-wiki] Cloning wiki repo...');
  const tmp = '/tmp/wiki';
  await execAsync(`rm -rf ${tmp} && git clone https://github.com/MageWuWu/Foreigners.Experience.within.China-.wiki.git ${tmp}`);
  
  console.log('[sync-wiki] Stripping markdown, outputting plain text...');
  const files = await fs.readdir(tmp);
  const destDir = path.resolve('site/pages/docs');
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = await fs.readFile(path.join(tmp, file), 'utf8');
    const plain = removeMd(content, { useImgAltText: true, gfm: true });
    const destFile = path.join(destDir, file.replace(/\.md$/, '.txt'));
    await fs.writeFile(destFile, plain, 'utf8');
    console.log(' → Written plain text:', path.basename(destFile));
  }

  console.log('[sync-wiki] Done.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncWiki().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

