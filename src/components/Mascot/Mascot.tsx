import { motion } from 'framer-motion'
import { MascotVariant, MascotMood } from '../../types'
import styles from './Mascot.module.css'

interface MascotProps {
  variant?: MascotVariant
  mood?: MascotMood
  size?: number
  animated?: boolean
}

export function Mascot({
  variant = 'sprout',
  mood = 'happy',
  size = 150,
  animated = true,
}: MascotProps) {
  const isCheer = mood === 'cheer'
  const isEncourage = mood === 'encourage'

  return (
    <motion.div
      className={styles.container}
      style={{ width: size, height: size }}
      animate={
        animated
          ? { y: [0, -(size * 0.04), 0] }
          : { y: 0 }
      }
      transition={
        animated
          ? { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0 }
      }
    >
      {/* ===== Toppers ===== */}
      {variant === 'sprout' && (
        <>
          <div className={styles.topperSproutLeaf} />
          <div className={styles.topperSproutLeaf2} />
        </>
      )}

      {variant === 'berry' && (
        <>
          <div className={styles.topperBerryStem} />
          <div style={{
            position: 'absolute',
            left: '48.5%',
            top: '2%',
            width: '3%',
            height: '13%',
            background: '#C98AA8',
            borderRadius: '6px',
            zIndex: 1,
          }} />
          <div className={styles.topperBerryFruit} />
          <div className={styles.topperBerryHighlight} />
        </>
      )}

      {variant === 'pebble' && (
        <>
          <div style={{
            position: 'absolute', left: '18%', top: '9%',
            width: '22%', height: '22%', background: '#6FB0C4', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', left: '60%', top: '9%',
            width: '22%', height: '22%', background: '#6FB0C4', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', left: '24%', top: '14%',
            width: '10%', height: '10%', background: '#D6ECF2', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', left: '66%', top: '14%',
            width: '10%', height: '10%', background: '#D6ECF2', borderRadius: '50%',
          }} />
        </>
      )}

      {variant === 'lily' && (
        <>
          <div style={{
            position: 'absolute', left: '48.5%', top: '8%',
            width: '3%', height: '9%', background: '#5C8560', borderRadius: '6px',
          }} />
          {[
            { l: '46%', t: '-5%' }, { l: '39%', t: '-1%' },
            { l: '53%', t: '-1%' }, { l: '41%', t: '5%' },
            { l: '51%', t: '5%' },
          ].map((p, i) => (
            <div key={i} style={{
              position: 'absolute', left: p.l, top: p.t,
              width: '8%', height: '8%', background: '#FBF6EC', borderRadius: '50%',
            }} />
          ))}
          <div style={{
            position: 'absolute', left: '45.5%', top: '1%',
            width: '9%', height: '9%', background: '#F4C766', borderRadius: '50%',
          }} />
        </>
      )}

      {variant === 'plum' && (
        <>
          <div style={{
            position: 'absolute', left: '48.5%', top: '7%',
            width: '3%', height: '10%', background: '#6E64A8', borderRadius: '6px',
          }} />
          <div style={{
            position: 'absolute', left: '39%', top: '-4%',
            width: '22%', height: '22%', background: '#F4C766',
            clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          }} />
        </>
      )}

      {variant === 'tango' && (
        <>
          <div style={{
            position: 'absolute', left: '19%', top: '4%',
            width: '22%', height: '20%', background: '#E8946A',
            clipPath: 'polygon(50% 0,0 100%,100% 100%)',
          }} />
          <div style={{
            position: 'absolute', left: '59%', top: '4%',
            width: '22%', height: '20%', background: '#E8946A',
            clipPath: 'polygon(50% 0,0 100%,100% 100%)',
          }} />
          <div style={{
            position: 'absolute', left: '25%', top: '11%',
            width: '10%', height: '11%', background: '#FBE0D2',
            clipPath: 'polygon(50% 0,0 100%,100% 100%)',
          }} />
          <div style={{
            position: 'absolute', left: '65%', top: '11%',
            width: '10%', height: '11%', background: '#FBE0D2',
            clipPath: 'polygon(50% 0,0 100%,100% 100%)',
          }} />
        </>
      )}

      {/* ===== Arms ===== */}
      {isCheer ? (
        <>
          <div style={{
            position: 'absolute', left: '2%', top: '34%',
            width: '15%', height: '12%', background: '#EBB347', borderRadius: '50%',
            transform: 'rotate(-34deg)',
          }} />
          <div style={{
            position: 'absolute', left: '83%', top: '34%',
            width: '15%', height: '12%', background: '#EBB347', borderRadius: '50%',
            transform: 'rotate(34deg)',
          }} />
        </>
      ) : (
        <>
          <div style={{
            position: 'absolute', left: '3%', top: '60%',
            width: '15%', height: '11%', background: '#EBB347', borderRadius: '50%',
            transform: 'rotate(24deg)',
          }} />
          <div style={{
            position: 'absolute', left: '82%', top: '60%',
            width: '15%', height: '11%', background: '#EBB347', borderRadius: '50%',
            transform: 'rotate(-24deg)',
          }} />
        </>
      )}

      {/* Right arm up for encourage mood too */}
      {(isCheer || isEncourage) && (
        <div style={{
          position: 'absolute', left: '83%', top: '34%',
          width: '15%', height: '12%', background: '#EBB347', borderRadius: '50%',
          transform: 'rotate(34deg)',
        }} />
      )}

      {/* ===== Body ===== */}
      {variant === 'sprout' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#F2BE54',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#FCE6B0',
            borderRadius: '50%',
          }} />
        </>
      )}
      {variant === 'berry' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#E58BA8',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#F8D9E4',
            borderRadius: '50%',
          }} />
        </>
      )}
      {variant === 'pebble' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#6FB0C4',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#D6ECF2',
            borderRadius: '50%',
          }} />
        </>
      )}
      {variant === 'lily' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#7BAE7F',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#DCEFD9',
            borderRadius: '50%',
          }} />
        </>
      )}
      {variant === 'plum' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#8F86C9',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#E2DEF4',
            borderRadius: '50%',
          }} />
        </>
      )}
      {variant === 'tango' && (
        <>
          <div style={{
            position: 'absolute', left: '13%', top: '15%',
            width: '74%', height: '74%', background: '#E8946A',
            borderRadius: '48% 48% 46% 46%',
          }} />
          <div style={{
            position: 'absolute', left: '27%', top: '48%',
            width: '46%', height: '40%', background: '#FBE0D2',
            borderRadius: '50%',
          }} />
        </>
      )}

      {/* ===== Face ===== */}
      <div className={styles.eyes} />
      <div className={`${styles.eyes} ${styles.eyesRight}`} />
      <div className={`${styles.eyeShine} ${styles.eyeShineLeft}`} />
      <div className={`${styles.eyeShine} ${styles.eyeShineRight}`} />
      <div className={styles.cheeks} />
      <div className={`${styles.cheeks} ${styles.cheeksRight}`} />

      {isCheer ? (
        <div className={styles.mouthCheer}>
          <div className={styles.mouthCheerTongue} />
        </div>
      ) : (
        <div className={styles.mouthHappy} />
      )}

      {/* ===== Sparkles (cheer only) ===== */}
      {isCheer && (
        <>
          <div className={styles.sparkle} style={{ left: '6%', top: '16%', animation: 'sparkleTwinkle 1.6s ease-in-out infinite' }} />
          <div className={styles.sparkle} style={{ left: '85%', top: '22%', width: '7%', height: '7%', animation: 'sparkleTwinkle 1.6s ease-in-out infinite 0.4s' }} />
          <div className={`${styles.sparkle} ${styles.sparkleGreen}`} style={{ left: '78%', top: '6%', width: '6%', height: '6%', animation: 'sparkleTwinkle 1.6s ease-in-out infinite 0.8s' }} />
        </>
      )}
    </motion.div>
  )
}
