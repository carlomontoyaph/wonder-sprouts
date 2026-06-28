import { motion } from 'framer-motion'
import { Mascot } from '../Mascot/Mascot'
import { AnswerArt } from '../AnswerArt/AnswerArt'
import { GAME_CONSTANTS } from '../../constants/game'

interface FeedbackBlockProps {
  wasCorrect: boolean
  mascotVariant: string
  factText: string
  talkPrompt: string
  revealArt?: string
  revealName?: string
  revealDesc?: string
  showReveal?: boolean
  topicKey?: string
}

export function FeedbackBlock({
  wasCorrect,
  mascotVariant,
  factText,
  talkPrompt,
  revealArt,
  revealName,
  revealDesc,
  showReveal,
  topicKey,
}: FeedbackBlockProps) {
  const feedbackColor = wasCorrect ? '#5C8560' : '#C8744E'
  const feedbackTitle = wasCorrect
    ? 'Yes! Great thinking!'
    : 'Good try — now you know!'
  const feedbackSub = wasCorrect
    ? 'You got it.'
    : 'Mistakes help us learn. Let’s keep going!'

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        marginTop: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Mascot + Reaction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 64, height: 64, flex: 'none' }}>
          <Mascot
            variant={mascotVariant as any}
            mood={wasCorrect ? 'cheer' : 'encourage'}
            size={64}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: feedbackColor,
          }}>
            {feedbackTitle}
          </div>
          <div style={{
            fontSize: 13.5,
            color: '#8A7C68',
            fontWeight: 600,
          }}>
            {feedbackSub}
          </div>

          {/* Reward badges (correct only) */}
          {wasCorrect && (
            <div style={{
              display: 'flex',
              gap: 8,
              marginTop: 7,
            }}>
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 12 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FFF3D6',
                  border: '1.5px solid #F2DCA0',
                  borderRadius: 999,
                  padding: '4px 10px 4px 8px',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  background: '#EBB347',
                  clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                }} />
                <span style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#B8862E',
                }}>
                  +{GAME_CONSTANTS.XP_CORRECT} XP
                </span>
              </motion.span>
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 12 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#FBEFD6',
                  border: '1.5px solid #F0DBA6',
                  borderRadius: 999,
                  padding: '4px 11px 4px 8px',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#E0A63E',
                }} />
                <span style={{
                  fontFamily: "'Baloo 2', sans-serif",
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#C68A1E',
                }}>
                  +{GAME_CONSTANTS.COINS_CORRECT}
                </span>
              </motion.span>
            </div>
          )}
        </div>
      </div>

      {/* Answer art reveal card */}
      {wasCorrect && showReveal && revealName && (
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.42, type: 'spring', stiffness: 300, damping: 12 }}
          style={{
            background: 'linear-gradient(160deg,#FFFFFF,#F6F1E8)',
            border: '2px solid #EFE2CC',
            borderRadius: 22,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{
            flex: 'none',
            width: 84,
            height: 84,
          }}>
            <AnswerArt kind={revealArt || ''} theme={topicKey} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#C8A24B',
            }}>
              You found it
            </div>
            <div style={{
              fontFamily: "'Baloo 2', sans-serif",
              fontWeight: 800,
              fontSize: 23,
              color: '#4A3A28',
              lineHeight: 1.1,
            }}>
              {revealName}
            </div>
            <div style={{
              fontSize: 13,
              color: '#8A7C68',
              fontWeight: 600,
            }}>
              {revealDesc}
            </div>
          </div>
        </motion.div>
      )}

      {/* Fun fact */}
      <div style={{
        background: '#FFF6E3',
        border: '2px solid #F4E6C7',
        borderRadius: 20,
        padding: 16,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 6,
        }}>
          <span style={{
            display: 'inline-block',
            width: 18,
            height: 18,
            background: '#EBB347',
            clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          }} />
          <span style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#B8862E',
          }}>
            Fun fact
          </span>
        </div>
        <div style={{
          fontSize: 15.5,
          lineHeight: 1.4,
          color: '#6E5A3A',
          fontWeight: 600,
        }}>
          {factText}
        </div>
      </div>

      {/* Talk together prompt */}
      <div style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        background: '#EEF5EE',
        border: '2px solid #D9E9D9',
        borderRadius: 20,
        padding: '14px 16px',
      }}>
        <span style={{
          flex: 'none',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#7BAE7F',
          marginTop: 2,
        }} />
        <div style={{
          fontSize: 14,
          lineHeight: 1.4,
          color: '#3E5C42',
          fontWeight: 700,
        }}>
          {talkPrompt}
        </div>
      </div>
    </motion.div>
  )
}
