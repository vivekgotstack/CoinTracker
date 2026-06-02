import './stats-visuals.css'

type StatsHeroEffectsProps = {
  isBehind: boolean
}

const sparks = Array.from({ length: 7 }, (_, index) => index)

const StatsHeroEffects = ({ isBehind }: StatsHeroEffectsProps) => {
  return (
    <div
      className={`stats-visuals ${isBehind ? 'stats-visuals-warning' : 'stats-visuals-profit'}`}
      aria-hidden="true"
    >
      <span className="cash-note">{'\u{1F4B5}'}</span>

      {isBehind
        ? sparks.map((item) => (
            <span key={`spark-${item}`} className={`electric-spark electric-spark-${item}`}>
              {'\u26A1'}
            </span>
          ))
        : null}
    </div>
  )
}

export default StatsHeroEffects
