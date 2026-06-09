/** Same extraction regex as the prototype's ytId() and the API. */
export function ytId(linkOrId: string): string {
  if (!linkOrId) return "";
  const m = String(linkOrId).match(
    /(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/,
  );
  return m ? m[1] : linkOrId.trim();
}

export function isValidYtId(linkOrId: string): boolean {
  return /^[\w-]{11}$/.test(ytId(linkOrId));
}

/** Thumbnail URL — works for unlisted videos too. */
export function ytThumb(linkOrId: string, q = "mqdefault"): string {
  const id = ytId(linkOrId);
  return /^[\w-]{11}$/.test(id)
    ? `https://i.ytimg.com/vi/${id}/${q}.jpg`
    : "";
}
