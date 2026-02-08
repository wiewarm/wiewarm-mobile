import { environment } from '../../../../environments/environment';

const ABS_URL = /^https?:\/\//i;

export const trimOrNull = (v?: string | null): string | null => {
  const t = v?.trim();
  return t ? t : null;
};

export function formatLocation(plz?: string, ort?: string): string {
  return [plz, ort]
    .map((v) => v?.trim())
    .filter(Boolean)
    .join(' ');
}

// Resolves a relative image path to an absolute URL, 
// or returns the input if it's already an absolute URL.
export function resolveImageUrl(
  path?: string,
  base = environment.imageBase,
): string | null {
  const p = trimOrNull(path);
  if (!p) return null;
  if (ABS_URL.test(p)) return p;

  const b = base.endsWith('/') ? base : `${base}/`;
  return new URL(p.replace(/^\/+/, ''), b).toString();
}

export function hashString(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(16);
}
