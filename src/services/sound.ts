import { useCallback } from 'react'

declare global {
  interface Window {
    FTSound?: {
      correct(): void
      wrong(): void
      tap(): void
      setMuted(b: boolean): boolean
      toggleMuted(): boolean
      isMuted(): boolean
    }
  }
}

export function useSound() {
  const playCorrect = useCallback(() => {
    window.FTSound?.correct()
  }, [])

  const playWrong = useCallback(() => {
    window.FTSound?.wrong()
  }, [])

  const playTap = useCallback(() => {
    window.FTSound?.tap()
  }, [])

  const toggleMute = useCallback(() => {
    return window.FTSound?.toggleMuted() ?? false
  }, [])

  const isMuted = useCallback(() => {
    return window.FTSound?.isMuted() ?? false
  }, [])

  const setMuted = useCallback((b: boolean) => {
    return window.FTSound?.setMuted(b) ?? false
  }, [])

  return { playCorrect, playWrong, playTap, toggleMute, isMuted, setMuted }
}
