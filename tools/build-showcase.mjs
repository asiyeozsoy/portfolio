// Encrypt the manifest and every media file before it enters the public website.
// Run after prepare-showcase.py. Credentials and source URLs remain in .private/.
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { createHash, randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const privateDir = path.join(root, '.private');
const target = path.join(root, 'slot-games');
await mkdir(privateDir, { recursive: true, mode: 0o700 });
await mkdir(path.join(target, 'data'), { recursive: true });
let password;
try { password = (await readFile(path.join(privateDir, 'portfolio-password.txt'), 'utf8')).trim(); }
catch { password = randomBytes(18).toString('base64url'); await writeFile(path.join(privateDir, 'portfolio-password.txt'), password + '\n', { mode: 0o600 }); }
let salt;
try { salt = Buffer.from(JSON.parse(await readFile(path.join(target, 'config.json'), 'utf8')).salt, 'base64'); }
catch {
  try { salt = await readFile(path.join(privateDir, 'build-salt.bin')); }
  catch { salt = randomBytes(16); }
}
await writeFile(path.join(privateDir, 'build-salt.bin'), salt, { mode: 0o600 });
const iterations = 600000;
const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256');
const keyId = createHash('sha256').update(key).digest('hex');
function encrypt(plain) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  return Buffer.concat([iv, cipher.update(plain), cipher.final(), cipher.getAuthTag()]);
}
const source = JSON.parse(await readFile(path.join(privateDir, 'source-manifest.json'), 'utf8'));
const manifest = structuredClone(source);
let cache = {};
try { cache = JSON.parse(await readFile(path.join(privateDir, 'media-cache.json'), 'utf8')); } catch {}
let count = 0;
for (const project of manifest.projects) {
  for (const row of project.rows) {
    for (const asset of row.assets || []) {
      const url = new URL(asset.url);
      if (url.protocol !== 'https:' || !['mir-s3-cdn-cf.behance.net', 'cdn-prod-ccv.adobe.com'].includes(url.hostname)) throw Error('Unexpected media source');
      const cacheId = createHash('sha256').update(url.origin + url.pathname).digest('hex');
      const filename = cacheId.slice(0, 24) + '.bin';
      let cached = cache[cacheId];
      if (cached) {
        try {
          const stored = await readFile(path.join(target, 'data', filename));
          const decipher = createDecipheriv('aes-256-gcm', key, stored.subarray(0, 12));
          decipher.setAuthTag(stored.subarray(-16));
          decipher.update(stored.subarray(12, -16));
          decipher.final();
        } catch { cached = null; }
      }
      if (!cached) {
        const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
        if (!response.ok) throw Error(`Media download failed (${response.status}): ${project.title}`);
        const plain = Buffer.from(await response.arrayBuffer());
        const mime = asset.mime || response.headers.get('content-type')?.split(';')[0];
        if (!mime || !/^(image|video)\//.test(mime)) throw Error('Unexpected media type');
        if (plain.length > 95 * 1024 * 1024) throw Error('Media exceeds the GitHub file limit');
        await writeFile(path.join(target, 'data', filename), encrypt(plain));
        cached = cache[cacheId] = { mime, size: plain.length, keyId };
        await writeFile(path.join(privateDir, 'media-cache.json'), JSON.stringify(cache));
      }
      delete asset.url;
      asset.path = 'data/' + filename;
      asset.mime = cached.mime;
      count++;
    }
  }
  delete project.sourceProject;
  console.log(`${project.title}: media encrypted`);
}
await writeFile(path.join(target, 'data', 'manifest.bin'), encrypt(Buffer.from(JSON.stringify(manifest))));
await writeFile(path.join(target, 'config.json'), JSON.stringify({ salt: salt.toString('base64'), iterations, manifest: 'data/manifest.bin' }));
console.log(`${manifest.projects.length} projects, ${count} media items. Password saved locally in .private/portfolio-password.txt.`);
