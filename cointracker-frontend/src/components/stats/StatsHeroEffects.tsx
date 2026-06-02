import './stats-visuals.css'

type StatsHeroEffectsProps = {
  isBehind: boolean
}

const cashNotes = Array.from({ length: 11 }, (_, index) => index)
const sparks = Array.from({ length: 7 }, (_, index) => index)

const StatsHeroEffects = ({ isBehind }: StatsHeroEffectsProps) => {
  return (
    <div
      className={`stats-visuals ${isBehind ? 'stats-visuals-warning' : 'stats-visuals-profit'}`}
      aria-hidden="true"
    >
      {cashNotes.map((item) => (
        <span key={`note-${item}`} className={`cash-note cash-note-${item}`}>
          <span />
        </span>
      ))}

      {isBehind
        ? sparks.map((item) => <span key={`spark-${item}`} className={`electric-spark electric-spark-${item}`} />)
        : null}
    </div>
  )
}

export default StatsHeroEffects
