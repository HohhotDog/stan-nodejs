export async function sha256Hex(blob: Blob): Promise<string> {
  const arr = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', arr);
  return toHex(new Uint8Array(digest));
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
