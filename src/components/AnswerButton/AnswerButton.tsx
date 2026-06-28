import { motion } from 'framer-motion'

interface AnswerButtonProps {
  letter: string
  text: string
  state: 'default' | 'correct' | 'wrong' | 'dimmed'
  onSelect: () => void
  disabled: boolean
}

const STATE_STYLES = {
  default: {
    bg: '#FFFFFF',
    border: undefined as string | undefined,
    txt: '#4A3A28',
    letterBg: undefined as string | undefined,
    letterTxt: undefined as string | undefined,
    icon: null as React.ReactNode,
  },
  correct: {
    bg: '#EAF4EA',
    border: '#7BAE7F',
    txt: '#3E6B45',
    letterBg: '#7BAE7F',
    letterTxt: '#FFFFFF',
    icon: <span style={{
      flex: 'none',
      width: 26,
      height: 26,
      borderRadius: '50%',
      background: '#7BAE7F',
      color: '#fff',
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>✓</span>,
  },
  wrong: {
    bg: '#FBEDE6',
    border: '#E0926A',
    txt: '#9C5A3C',
    letterBg: '#E8946A',
    letterTxt: '#FFFFFF',
    icon: <span style={{
      flex: 'none',
      fontSize: 12,
      fontWeight: 800,
      color: '#C8744E',
      letterSpacing: '0.02em',
    }}>Almost!</span>,
  },
  dimmed: {
    bg: '#FFFFFF',
    border: '#F0E7D6',
    txt: '#4A3A28',
    letterBg: '#F1EADC',
    letterTxt: '#9A8E7C',
    icon: null,
  },
}

export function AnswerButton({
  letter,
  text,
  state,
  onSelect,
  disabled,
}: AnswerButtonProps) {
  const s = STATE_STYLES[state]
  const isCorrectCelebration = state === 'correct'
  const isWrong = state === 'wrong'

  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        isCorrectCelebration
          ? { scale: [1, 1.035, 1] }
          : isWrong
            ? { x: [0, -5, 4, -3, 2, 0] }
            : { scale: 1, x: 0 }
      }
      transition={isCorrectCelebration || isWrong ? { duration: 0.5 } : { duration: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        width: '100%',
        textAlign: 'left',
        padding: '15px 16px',
        borderRadius: 18,
        border: `2px solid ${s.border || '#E7DCC8'}`,
        background: s.bg,
        opacity: state === 'dimmed' ? 0.55 : 1,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'Nunito, sans-serif',
        fontWeight: 700,
        fontSize: 17,
        color: s.txt,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        boxShadow: '0 3px 0 rgba(74,58,40,0.04)',
      }}
    >
      <span style={{
        flex: 'none',
        width: 34,
        height: 34,
        borderRadius: 11,
        background: s.letterBg || '#E7DCC8',
        color: s.letterTxt || '#8A7C68',
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 700,
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {letter}
      </span>
      <span style={{ flex: 1 }}>{text}</span>
      {s.icon}
    </motion.button>
  )
}
