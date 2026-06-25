import fs from "fs";
import path from "path";

const ignoreDirs = [".next", "node_modules", ".git"];

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignoreDirs.includes(file)) continue;
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else {
      filelist.push({ filepath, mtime: stat.mtimeMs });
    }
  }
  return filelist;
}

try {
  const now = Date.now();
  const files = walk(".");
  const recent = files
    .filter(f => now - f.mtime < 120000) // last 2 minutes
    .sort((a, b) => b.mtime - a.mtime);

  console.log(`Recently modified files (last 2 minutes): ${recent.length}`);
  recent.slice(0, 10).forEach(f => {
    console.log(`  ${f.filepath} (modified ${(now - f.mtime)/1000}s ago)`);
  });
} catch (e) {
  console.error(e);
}
