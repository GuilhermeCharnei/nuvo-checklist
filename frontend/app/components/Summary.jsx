'use client'

import ProgressBar from './ProgressBar'

export default function Summary({ client, onArchive }) {
  const { progress, environments } = client

  if (!progress) return null

  // Calcular totais
  const totalPieces = progress.total || 0
  const assembled = progress.assembled || 0
  const doors = progress.doors || 0
  const shipped = progress.shipped || 0

  // Calcular progresso por ambiente
  const environmentProgress = environments.map(env => ({
    name: env.name,
    ...env.progress
  }))

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📊 Resumo Geral</h2>
        <button
          onClick={onArchive}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Arquivar Projeto
        </button>
      </div>

      {/* Progresso Total */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">Progresso Total</div>
        <ProgressBar progress={progress.shipped_percent} showLabel={false} />
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Gabinetes */}
        <div>
          <div className="text-sm text-gray-600 mb-1">📦 Montado</div>
          <div className="text-2xl font-bold text-gray-900">
            {assembled}/{totalPieces}
          </div>
          <div className="text-xs text-gray-500">{progress.assembled_percent}%</div>
        </div>

        {/* Portas */}
        <div>
          <div className="text-sm text-gray-600 mb-1">🚪 Portas</div>
          <div className="text-2xl font-bold text-gray-900">
            {doors}/{totalPieces}
          </div>
          <div className="text-xs text-gray-500">{progress.doors_percent}%</div>
        </div>

        {/* Embarcado */}
        <div className="col-span-2">
          <div className="text-sm text-gray-600 mb-1">🚚 Embarcado</div>
          <div className="text-2xl font-bold text-primary">
            {shipped}/{totalPieces}
          </div>
          <div className="text-xs text-gray-500">{progress.shipped_percent}%</div>
        </div>
      </div>

      {/* Progresso por Ambiente */}
      {environmentProgress.length > 0 && (
        <>
          <div className="text-sm font-bold text-gray-700 mb-3">🚚 Resumo por Ambiente</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-2">Ambiente</th>
                  <th className="text-center px-2">Mont</th>
                  <th className="text-center px-2">Port</th>
                  <th className="text-center px-2">Emb</th>
                </tr>
              </thead>
              <tbody>
                {environmentProgress.map((env, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 pr-2 font-medium truncate max-w-[120px]">
                      {env.name}
                    </td>
                    <td className="text-center px-2 text-gray-600">
                      {env.assembled || '0/0'}
                    </td>
                    <td className="text-center px-2 text-gray-600">
                      {env.doors || '0/0'}
                    </td>
                    <td className="text-center px-2 text-primary font-semibold">
                      {env.shipped || '0/0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
