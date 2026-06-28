/** Format seconds into a human-readable duration string. */
export function formatTime(seconds: number): string {
  const m = Math.round((seconds || 0) / 60)
  if (m < 60) return m + ' min'
  return Math.floor(m / 60) + 'h ' + (m % 60) + 'm'
}
