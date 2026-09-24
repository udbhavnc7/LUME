import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd(), 'src');
const violations = [];

function walk(dir) {
  return readdir(dir, { withFileTypes: true }).then(async entries => {
    for (const entry of entries) {
      const target = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(target);
        continue;
      }
      if (!/\.(ts|tsx)$/.test(entry.name)) continue;
      const source = await readFile(target, 'utf8');
      const relativePath = path.relative(process.cwd(), target).split(path.sep).join('/');
      source.split(/\r?\n/).forEach((line, index) => {
        const lineNumber = index + 1;
        if (/from\s+['"][^'"]*faker[^'"]*['"]|import\s+['"][^'"]*faker[^'"]*['"]/i.test(line)) {
          violations.push({ relativePath, lineNumber, rule: 'faker-import', snippet: line.trim() });
        }
        if (/from\s+['"][^'"]*mock[^'"]*['"]|import\s+['"][^'"]*mock[^'"]*['"]/i.test(line)) {
          violations.push({ relativePath, lineNumber, rule: 'mock-import', snippet: line.trim() });
        }
        if (/\bMOCK_/.test(line)) {
          violations.push({ relativePath, lineNumber, rule: 'mock-identifier', snippet: line.trim() });
        }
        if (/Math\.random\s*\(/.test(line) && !/\bid\s*[:=]/i.test(line)) {
          violations.push({ relativePath, lineNumber, rule: 'random-displayed-value', snippet: line.trim() });
        }
      });
    }
  });
}

await walk(root);

if (violations.length > 0) {
  console.error(`Data-contract lint failed with ${violations.length} violation(s):`);
  for (const violation of violations) {
    console.error(`${violation.relativePath}:${violation.lineNumber} [${violation.rule}] ${violation.snippet}`);
  }
  process.exit(1);
}

console.log('Data-contract lint passed.');
