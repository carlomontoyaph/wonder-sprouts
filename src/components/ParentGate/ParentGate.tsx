interface ParentGateProps {
  gateA: number
  gateB: number
  gateChoices: number[]
  gateError: boolean
  onAnswer: (value: number) => void
}

export function ParentGate({
  gateA,
  gateB,
  gateChoices,
  gateError,
  onAnswer,
}: ParentGateProps) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      minHeight: '60vh',
      textAlign: 'center',
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: '#EDE6F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7C6BA8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      </div>
      <div>
        <div style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 800,
          fontSize: 22,
          color: '#4A3A28',
        }}>
          Grown-ups only
        </div>
        <div style={{
          fontSize: 14,
          color: '#9A8E7C',
          fontWeight: 600,
          maxWidth: 260,
        }}>
          Answer to continue to the parent dashboard.
        </div>
      </div>
      <div style={{
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 800,
        fontSize: 30,
        color: '#4A3A28',
      }}>
        {gateA} + {gateB} = ?
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        {gateChoices.map((v, i) => (
          <button
            key={i}
            onClick={() => onAnswer(v)}
            style={{
              width: 64,
              height: 64,
              cursor: 'pointer',
              background: '#FFFFFF',
              border: '2px solid #E6DAC4',
              borderRadius: 18,
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: 24,
              color: '#4A3A28',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      {gateError && (
        <div style={{
          fontSize: 13.5,
          color: '#C8744E',
          fontWeight: 700,
        }}>
          Not quite — try the new question.
        </div>
      )}
    </div>
  )
}
