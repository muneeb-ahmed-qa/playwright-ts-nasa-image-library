export function normalizeTitle(s: string): string {
  return s
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}
export function extractNasaId(s: string): string {
  return s.replace('NASA ID: ', '').trim();
}