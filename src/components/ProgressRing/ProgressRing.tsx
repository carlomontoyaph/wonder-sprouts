interface ProgressRingProps {
  correctCount: number
  total: number
}

export function ProgressRing({ correctCount, total }: ProgressRingProps) {
  const ringDeg = total > 0 ? `${(correctCount / total) * 360}deg` : '0deg'

  return (
    <div style={{
      position: 'relative',
      width: 128,
      height: 128,
      margin: '4px 0',
    }}>
      <div style={{
        width: 128,
        height: 128,
        borderRadius: '50%',
        background: `conic-gradient(#7BAE7F ${ringDeg}, #ECE3D2 0)`,
      }} />
      <div style={{
        position: 'absolute',
        inset: 13,
        borderRadius: '50%',
        background: '#FBF7F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 800,
          fontSize: 32,
          color: '#4A3A28',
          lineHeight: 1,
        }}>
          {correctCount}
        </span>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#9A8E7C',
        }}>
          of {total} right
        </span>
      </div>
    </div>
  )
}
