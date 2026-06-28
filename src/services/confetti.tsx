import { createElement } from 'react'

interface ConfettiBurstProps {
  colors?: string
  originX?: number
  originY?: number
  count?: number
}

/**
 * Renders a <confetti-burst> custom element that auto-fires on mount
 * and auto-removes itself when the animation finishes.
 */
export function ConfettiBurst({
  colors,
  originX = 0.5,
  originY = 0.32,
  count,
}: ConfettiBurstProps) {
  const props: Record<string, unknown> = {
    style: {
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      zIndex: 40,
    },
    'origin-x': originX,
    'origin-y': originY,
  }
  if (colors) props.colors = colors
  if (count) props.count = count

  return createElement('confetti-burst', props)
}

export function getConfettiColors(topicKey: string): string {
  if (topicKey === 'space') {
    return '#7C84C4,#9AA0DC,#EBB347,#F4C766,#C9CEEF,#7BAE7F'
  }
  if (topicKey === 'dinos') {
    return '#E8946A,#C8744E,#7BAE7F,#EBB347,#F2998E,#F4C766'
  }
  return '#7BAE7F,#9AC79A,#EBB347,#E8946A,#F2998E,#F4C766'
}
