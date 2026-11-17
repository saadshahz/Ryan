/**
 * Sizes an Unsplash image URL for the current viewport.
 *
 * Full-width backgrounds are authored at 2200–2400px for large desktops. On phones and
 * tablets that wastes bandwidth, so the `w=` parameter is reduced to the viewport width ×
 * pixel density (capped at 2×), rounded up to 200px steps and never above the original.
 */
export function fitWidth(url: string, minWidth = 640) {
  if (typeof window === "undefined") return url;
  const match = url.match(/[?&]w=(\d+)/);
  if (!match) return url;
  const original = Number(match[1]);
  const density = Math.min(window.devicePixelRatio || 1, 2);
  const needed = Math.ceil((window.innerWidth * density) / 200) * 200;
  const width = Math.min(original, Math.max(minWidth, needed));
  return url.replace(/([?&])w=\d+/, `$1w=${width}`);
}
