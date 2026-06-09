/** Extract the 11-char YouTube id from any URL form (same regex as the prototype's ytId). */
export function extractYoutubeId(linkOrId: string): string | null {
  if (!linkOrId) return null;
  const m = String(linkOrId).match(
    /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/,
  );
  const id = m ? m[1] : linkOrId.trim();
  return /^[\w-]{11}$/.test(id) ? id : null;
}
