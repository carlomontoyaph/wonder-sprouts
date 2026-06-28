import { motion } from 'framer-motion'
import { useGame } from '../../context/GameContext'
import { Mascot } from '../../components/Mascot/Mascot'
import { ToggleSwitch } from '../../components/ToggleSwitch/ToggleSwitch'
import { MascotVariant } from '../../types'
import styles from './SettingsScreen.module.css'

const AVATAR_VARIANTS: MascotVariant[] = [
  'sprout', 'berry', 'pebble', 'lily', 'plum', 'tango',
]

export function SettingsScreen() {
  const { state, dispatch } = useGame()

  return (
    <motion.div
      initial={{ y: 14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={styles.screen}
    >
      <div className={styles.pageTitle}>Settings</div>

      {/* Name + Avatar */}
      <div>
        <div className={styles.sectionLabel}>Who's playing?</div>
        <div className={styles.card}>
          {/* Name */}
          <div>
            <label className={styles.fieldLabel}>My name</label>
            <input
              value={state.childName}
              onChange={(e) => {
                dispatch({ type: 'SET_CHILD_NAME', name: e.target.value })
              }}
              placeholder="Type your name"
              className={styles.nameInput}
              maxLength={14}
            />
          </div>

          {/* Avatar picker */}
          <div>
            <div className={styles.fieldLabel}>My buddy</div>
            <div className={styles.avatarGrid}>
              {AVATAR_VARIANTS.map((variant) => {
                const selected = state.avatarVariant === variant
                return (
                  <button
                    key={variant}
                    onClick={() => {
                      if (window.FTSound) window.FTSound.tap()
                      dispatch({ type: 'SET_AVATAR', variant })
                    }}
                    className={styles.avatarBtn}
                    style={{
                      border: `${
                        selected ? 3 : 2
                      }px solid ${selected ? '#E8946A' : '#EFE2CC'}`,
                    }}
                  >
                    <span className={styles.avatarPreview}>
                      <Mascot variant={variant} mood="happy" size={52} />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <div className={styles.sectionLabel}>Preferences</div>
        <div className={styles.card}>
          {/* Sound */}
          <div className={styles.preferenceRow}>
            <div>
              <div className={styles.prefTitle}>Sound & cheers</div>
              <div className={styles.prefDesc}>Pops and celebrations</div>
            </div>
            <ToggleSwitch
              enabled={!state.muted}
              onToggle={() => {
                if (window.FTSound) window.FTSound.setMuted(!state.muted)
                dispatch({ type: 'TOGGLE_MUTE' })
              }}
              ariaLabel="Toggle sound"
            />
          </div>

          {/* Reduce motion */}
          <div className={styles.preferenceRow}>
            <div>
              <div className={styles.prefTitle}>Reduce motion</div>
              <div className={styles.prefDesc}>Calmer, gentler screens</div>
            </div>
            <ToggleSwitch
              enabled={state.reduceMotion}
              onToggle={() => {
                if (window.FTSound) window.FTSound.tap()
                dispatch({ type: 'TOGGLE_REDUCE_MOTION' })
              }}
              ariaLabel="Toggle reduce motion"
            />
          </div>

          {/* Bigger text */}
          <div className={styles.preferenceRow}>
            <div>
              <div className={styles.prefTitle}>Bigger text</div>
              <div className={styles.prefDesc}>Easier to read</div>
            </div>
            <ToggleSwitch
              enabled={state.textBig}
              onToggle={() => {
                if (window.FTSound) window.FTSound.tap()
                dispatch({ type: 'TOGGLE_TEXT_BIG' })
              }}
              ariaLabel="Toggle bigger text"
            />
          </div>
        </div>
      </div>

      {/* How to play */}
      <div className={styles.howToPlayCard}>
        <div className={styles.howToPlayMascot}>
          <Mascot variant="sprout" mood="happy" size={54} />
        </div>
        <div>
          <div className={styles.howToPlayTitle}>How to play</div>
          <div className={styles.howToPlayDesc}>
            Pick a topic, tap the answer you think is right, then read the fun
            fact together and chat about it. There are no wrong answers in the
            talking part!
          </div>
        </div>
      </div>

      {/* About */}
      <div className={styles.aboutRow}>
        <span className={styles.versionText}>
          Made for curious families · Wonder Sprouts v0.1
        </span>
        <button
          onClick={() => {
            if (window.FTSound) window.FTSound.tap()
            dispatch({ type: 'GO_PARENTS' })
          }}
          className={styles.parentBtn}
        >
          Parent settings
        </button>
      </div>
    </motion.div>
  )
}
