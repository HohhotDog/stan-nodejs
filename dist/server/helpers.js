import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';
export function loadData(filePath) {
  var abs = path.resolve(process.cwd(), filePath);
  var raw = fs.readFileSync(abs, 'utf8');
  var json = JSON.parse(raw);
  return json.map(it => ({
    id: Number(it.id),
    image: String(it.image)
  }));
}
export function sha256HexBuffer(buf) {
  return createHash('sha256').update(buf).digest('hex');
}
export function green(s) {
  return "\x1B[32m".concat(s, "\x1B[0m");
}
export function red(s) {
  return "\x1B[31m".concat(s, "\x1B[0m");
}