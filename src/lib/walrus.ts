export function randomWalrusId() {
  // Demo-friendly deterministic-ish ID
  const base = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(base)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
