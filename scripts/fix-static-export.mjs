// Next.js can export nested RSC segment paths on Windows, while the browser
// requests flat filenames. Keep the exported files and add the expected aliases.
// https://github.com/vercel/next.js/issues/92339
import { copyFile, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.isFile()) yield path;
  }
}

let repaired = 0;
async function repairSegments(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === '_next') continue;
    const path = join(directory, entry.name);
    if (!entry.name.startsWith('__next.')) {
      await repairSegments(path);
      continue;
    }
    for await (const source of files(path)) {
      if (!source.endsWith('.txt')) continue;
      const filename = `${entry.name}.${relative(path, source).split(sep).join('.')}`;
      try {
        await copyFile(source, join(directory, filename), constants.COPYFILE_EXCL);
        repaired++;
      } catch (error) {
        if (error.code !== 'EEXIST') throw error;
      }
    }
  }
}

await repairSegments(resolve('out'));
console.log(`Static export ready (${repaired} segment paths repaired).`);
