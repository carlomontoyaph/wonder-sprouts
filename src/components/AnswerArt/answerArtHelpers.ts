import { CSSProperties } from 'react'

/**
 * Convert percentage-based position values to React inline style.
 * Mimics the `position: absolute; left: X%; top: Y%; width: W%; height: H%` pattern
 * from the AnswerArt.dc.html design file.
 */
export function pos(
  left: string,
  top: string,
  width: string,
  height: string,
  extra?: CSSProperties,
): CSSProperties {
  return {
    position: 'absolute',
    left,
    top,
    width,
    height,
    ...extra,
  }
}
