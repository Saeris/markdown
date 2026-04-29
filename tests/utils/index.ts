export function normalizeHtml(html: string): string {
  return html.replace(/>\s+</g, "><").trim();
}
