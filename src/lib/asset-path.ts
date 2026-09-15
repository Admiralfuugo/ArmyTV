/** Public files need the same build-time prefix as Next.js routes. */
export function assetPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
