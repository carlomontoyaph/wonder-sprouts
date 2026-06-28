interface BadgeItemProps {
  label: string
  earned: boolean
  color: string
}

export function BadgeItem({ label, earned, color }: BadgeItemProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7,
    }}>
      <div style={{
        width: 62,
        height: 62,
        borderRadius: '50%',
        background: earned ? color : '#F1EADC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          width: 30,
          height: 30,
          opacity: earned ? 1 : 0.4,
          background: earned ? '#FFFFFF' : '#C7BCA8',
          clipPath: 'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
          display: 'block',
        }} />
      </div>
      <span style={{
        fontFamily: "'Baloo 2', sans-serif",
        fontWeight: 700,
        fontSize: 11.5,
        color: earned ? '#6E5A3A' : '#B7A98E',
        textAlign: 'center',
        lineHeight: 1.15,
      }}>
        {label}
      </span>
    </div>
  )
}
