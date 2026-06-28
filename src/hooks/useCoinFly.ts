import { useEffect, useState } from 'react'

interface CoinPiece {
  id: number
  sx: number
  sy: number
  delay: number
}

/**
 * Manages the flying-coins animation pieces.
 * Returns an array of coin pieces when active, empty array otherwise.
 */
export function useCoinFly(
  pulseCoins: boolean,
  reduceMotion: boolean,
): CoinPiece[] {
  const [pieces, setPieces] = useState<CoinPiece[]>([])

  useEffect(() => {
    if (!pulseCoins || reduceMotion) {
      setPieces([])
      return
    }

    const coinData: CoinPiece[] = [
      { id: 0, sx: -90, sy: 240, delay: 0 },
      { id: 1, sx: -140, sy: 210, delay: 0.06 },
      { id: 2, sx: -60, sy: 270, delay: 0.12 },
      { id: 3, sx: -170, sy: 180, delay: 0.18 },
      { id: 4, sx: -110, sy: 300, delay: 0.24 },
    ]
    setPieces(coinData)

    const timer = setTimeout(() => {
      setPieces([])
    }, 1000)

    return () => clearTimeout(timer)
  }, [pulseCoins, reduceMotion])

  return pieces
}
