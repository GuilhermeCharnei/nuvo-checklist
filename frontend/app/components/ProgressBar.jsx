export default function ProgressBar({ progress, showLabel = true }) {
  const getColor = (value) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div
          className={`progress-fill ${getColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
