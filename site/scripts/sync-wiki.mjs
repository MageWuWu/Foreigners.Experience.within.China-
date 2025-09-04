import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const WIKI_GIT = 'https://github.com/MageWuWu/Foreigners.Experience.within.China-.wiki.git'
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'wiki-'))

console.log('[sync-wiki] cloning wiki...')
execSync(`git clone --depth 1 "${WIKI_GIT}" "${tmp}"`, { stdio: 'inherit' })

const docsDir = path.join(process.cwd(), 'pages', 'docs')
fs.rmSync(docsDir, { recursive: true, force: true })
fs.mkdirSync(docsDir, { recursive: true })

console.log('[sync-wiki] copying files...')
copyRecursive(tmp, docsDir)

const homeMd = path.join(docsDir, 'Home.md')
const indexMd = path.join(docsDir, 'index.md')
if (fs.existsSync(homeMd)) fs.renameSync(homeMd, indexMd)

console.log('[sync-wiki] done → pages/docs')

function copyRecursive(src, dest) {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === '.git') continue
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(d, { recursive: true })
      copyRecursive(s, d)
    } else {
      fs.copyFileSync(s, d)
    }
  }
}