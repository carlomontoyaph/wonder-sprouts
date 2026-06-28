import { motion } from 'framer-motion'

interface QuestionCardProps {
  qNumber: number
  questionText: string
  topicIcon: string
  topicColor: string
  topicSoft: string
}

export function QuestionCard({
  qNumber,
  questionText,
  topicIcon,
  topicColor,
  topicSoft,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'relative',
        zIndex: 1,
        background: '#FFFFFF',
        border: `2px solid ${topicColor}`,
        borderRadius: 24,
        padding: 20,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
      }}>
        <span
          style={{
            flex: 'none',
            width: 48,
            height: 48,
            borderRadius: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: topicSoft,
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: topicIcon }}
        />
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: topicColor,
            color: '#fff',
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            padding: '5px 12px',
            borderRadius: 999,
          }}
        >
          Question {qNumber}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Baloo 2', sans-serif",
          fontWeight: 700,
          fontSize: 23,
          lineHeight: 1.25,
          color: '#4A3A28',
        }}
      >
        {questionText}
      </div>
    </motion.div>
  )
}
