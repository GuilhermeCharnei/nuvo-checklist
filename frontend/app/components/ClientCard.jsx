'use client'

import Link from 'next/link'
import ProgressBar from './ProgressBar'

export default function ClientCard({ client }) {
  const { id, name, job_name, environment_count, updated_at, progress } = client

  const overallProgress = progress?.shipped_percent || 0

  // Calcular tempo desde última atualização
  const getTimeAgo = (date) => {
    const now = new Date()
    const updated = new Date(date)
    const diffMs = now - updated
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? 's' : ''}`
    if (diffHours > 0) return `${diffHours}h`
    return 'agora'
  }

  return (
    <Link href={`/client/${id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{name}</h2>
            {job_name && (
              <p className="text-sm text-gray-600">{job_name}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar progress={overallProgress} />

        {/* Stats */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{environment_count} ambiente{environment_count !== 1 ? 's' : ''}</span>
          <span>Atualizado há {getTimeAgo(updated_at)}</span>
        </div>

        {/* Progress Details */}
        {progress && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-gray-600">Montado</div>
              <div className="font-semibold text-gray-900">{progress.assembled_percent}%</div>
            </div>
            <div>
              <div className="text-gray-600">Portas</div>
              <div className="font-semibold text-gray-900">{progress.doors_percent}%</div>
            </div>
            <div>
              <div className="text-gray-600">Embarcado</div>
              <div className="font-semibold text-primary">{progress.shipped_percent}%</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex space-x-2">
          <button
            className="flex-1 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault()
              window.location.href = `/client/${id}`
            }}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </Link>
  )
}
