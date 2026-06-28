import { motion } from 'framer-motion'

interface ToggleSwitchProps {
  enabled: boolean
  onToggle: () => void
  ariaLabel: string
}

export function ToggleSwitch({ enabled, onToggle, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={ariaLabel}
      style={{
        flex: 'none',
        width: 42,
        height: 24,
        borderRadius: 999,
        border: 0,
        cursor: 'pointer',
        background: enabled ? '#7BAE7F' : '#E4D8C2',
        position: 'relative',
        transition: 'background 0.2s ease',
      }}
    >
      <motion.span
        style={{
          position: 'absolute',
          top: 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
        animate={{ left: enabled ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
