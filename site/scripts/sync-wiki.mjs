import { remark } from 'remark';
import strip from 'strip-markdown';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function syncWiki() {
  console.log('[sync-wiki] Cloning wiki...');
  const tmpDir = '/tmp/wiki';
  await execAsync(`rm -rf ${tmpDir} && git clone https://github.com/MageWuWu/Foreigners.Experience.within.China-.wiki.git ${tmpDir}`);
  console.log('[sync-wiki] Copying and stripping text from .md files...');

  const docsDir = path.resolve('site/pages/docs');
  await fs.rm(docsDir, { recursive: true, force: true });
  await fs.mkdir(docsDir, { recursive: true });

  const files = await fs.readdir(tmpDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const src = path.join(tmpDir, file);
      const dest = path.join(docsDir, file);
      const md = await fs.readFile(src, 'utf8');

      const processed = await remark()
        .use(strip)
        .process(md);

      const text = String(processed);
      await fs.writeFile(dest, text);
      console.log(` → processed ${file}`);
    }
  }

  console.log('[sync-wiki] Done → site/pages/docs');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncWiki().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
