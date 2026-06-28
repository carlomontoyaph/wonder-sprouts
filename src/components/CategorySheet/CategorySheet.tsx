import { motion, AnimatePresence } from 'framer-motion'
import { CategoryKey } from '../../types'
import { CATEGORIES, CATEGORY_DOTS, TOPICS } from '../../data/topics'

interface CategorySheetProps {
  open: boolean
  currentFilter: CategoryKey
  hiddenTopics: Record<string, boolean>
  onSelect: (filter: CategoryKey) => void
  onClose: () => void
}

export function CategorySheet({
  open,
  currentFilter,
  hiddenTopics,
  onSelect,
  onClose,
}: CategorySheetProps) {
  const catCount = (k: CategoryKey) =>
    TOPICS.filter((tp) => !hiddenTopics[tp.key]).filter(
      (tp) => k === 'all' || tp.cat === k,
    ).length

  return (
    <AnimatePresence>
      {open && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
        }}>
          <motion.div
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(74,58,40,0.18)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.div
            style={{
              position: 'relative',
              width: 'min(280px, calc(100% - 32px))',
              margin: '92px 16px 0 0',
              background: '#FFFFFF',
              border: '1.5px solid #F0E7D6',
              borderRadius: 20,
              padding: 12,
              boxShadow: '0 16px 36px rgba(74,58,40,0.20)',
              transformOrigin: 'top right',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '2px 4px 10px',
            }}>
              <span style={{
                fontFamily: "'Baloo 2', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: '#4A3A28',
              }}>
                Category
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: '1.5px solid #EFE2CC',
                  background: '#FFF',
                  cursor: 'pointer',
                  color: '#A89A85',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {CATEGORIES.map((c) => {
                const isActive = currentFilter === c.key
                const count = catCount(c.key as CategoryKey)
                return (
                  <button
                    key={c.key}
                    onClick={() => onSelect(c.key as CategoryKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isActive ? '#FBF3E8' : '#FFFFFF',
                      border: `2px solid ${isActive ? '#E8B04D' : '#F0E7D6'}`,
                      borderRadius: 14,
                      padding: '11px 12px',
                      transition: 'background 0.15s ease, border-color 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span style={{
                      flex: 'none',
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      background: CATEGORY_DOTS[c.key as CategoryKey],
                    }} />
                    <span style={{
                      flex: 1,
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 700,
                      fontSize: 15,
                      color: '#4A3A28',
                    }}>
                      {c.label}
                    </span>
                    <span style={{
                      fontFamily: "'Baloo 2', sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      color: '#A89A85',
                      background: '#FBF7F0',
                      border: '1.5px solid #F0E7D6',
                      borderRadius: 999,
                      padding: '1px 8px',
                    }}>
                      {count}
                    </span>
                    {isActive && (
                      <span style={{
                        flex: 'none',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#E8B04D',
                        color: '#fff',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
