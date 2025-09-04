import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function syncWiki() {
  console.log('[sync-wiki] Cloning wiki...');
  const tmpDir = '/tmp/wiki';
  await execAsync(`rm -rf ${tmpDir} && git clone https://github.com/MageWuWu/Foreigners.Experience.within.China-.wiki.git ${tmpDir}`);

  const docsDir = path.resolve('site/pages/docs');
  await fs.rm(docsDir, { recursive: true, force: true });
  await fs.mkdir(docsDir, { recursive: true });

  const files = await fs.readdir(tmpDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      let dest = path.join(docsDir, file.replace(/\.md$/, '.mdx'));
      // 首页特殊处理
      if (file === 'Home.md') {
        dest = path.join(docsDir, 'index.mdx');
      }
      const src = path.join(tmpDir, file);
      const md = await fs.readFile(src, 'utf8');
      await fs.writeFile(dest, md);
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
