'use client'

import { useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ChecklistItem({ piece, onUpdate }) {
  const [showDoorsModal, setShowDoorsModal] = useState(false)
  const [showShippedModal, setShowShippedModal] = useState(false)
  const [newCheckpoint, setNewCheckpoint] = useState('')
  const [showAddCheckpoint, setShowAddCheckpoint] = useState(false)

  const { id, cab_number, name, width, height, depth, finished, progress } = piece

  const updateProgress = async (updates) => {
    try {
      await axios.put(`${API_URL}/pieces/${id}/progress`, updates)
      onUpdate()
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
    }
  }

  const handleAssembledChange = (checked) => {
    updateProgress({ assembled: checked })
  }

  const handleDoorsSelect = (status) => {
    updateProgress({ doors_status: status })
    setShowDoorsModal(false)
  }

  const handleShippedChange = () => {
    if (!progress.assembled) {
      alert('Peça precisa estar montada antes de embarcar')
      return
    }
    setShowShippedModal(true)
  }

  const confirmShipped = () => {
    updateProgress({ shipped: true })
    setShowShippedModal(false)
  }

  const addCustomCheckpoint = () => {
    if (!newCheckpoint.trim()) return

    const checkpoints = progress.custom_checkpoints || []
    checkpoints.push({
      name: newCheckpoint.trim(),
      checked: false
    })

    updateProgress({ custom_checkpoints: checkpoints })
    setNewCheckpoint('')
    setShowAddCheckpoint(false)
  }

  const toggleCustomCheckpoint = (index) => {
    const checkpoints = [...(progress.custom_checkpoints || [])]
    checkpoints[index].checked = !checkpoints[index].checked
    updateProgress({ custom_checkpoints: checkpoints })
  }

  // Status visual
  const getStatusBadge = () => {
    if (progress.shipped) return <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">🚚 Embarcado</span>
    if (progress.doors_status) return <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">🚪 Portas OK</span>
    if (progress.assembled) return <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">🔧 Montado</span>
    return <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">⏳ Pendente</span>
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            {cab_number && (
              <span className="text-sm font-semibold text-gray-700">
                Cab# {cab_number}
              </span>
            )}
            {getStatusBadge()}
          </div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <div className="text-sm text-gray-600 mt-1">
            {width && height && depth && (
              <span>{width}" × {height}" × {depth}"</span>
            )}
            {finished && <span className="ml-2">• Acabamento: {finished}</span>}
          </div>
        </div>
      </div>

      {/* Checkboxes Padrão */}
      <div className="space-y-2">
        {/* Montado */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={progress.assembled}
            onChange={(e) => handleAssembledChange(e.target.checked)}
            className="checkbox"
          />
          <span className={progress.assembled ? 'line-through text-gray-500' : ''}>
            Montado
          </span>
          {progress.assembled && <span className="text-green-500">✓</span>}
        </label>

        {/* Portas */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={!!progress.doors_status}
            onChange={() => setShowDoorsModal(true)}
            className="checkbox"
            disabled={!progress.assembled}
          />
          <span className={progress.doors_status ? 'line-through text-gray-500' : ''}>
            Portas {progress.doors_status && `(${progress.doors_status === 'placed' ? 'Colocadas' : 'Embaladas'})`}
          </span>
          {progress.doors_status && <span className="text-green-500">✓</span>}
        </div>

        {/* Embarcado */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={progress.shipped}
            onChange={handleShippedChange}
            className="checkbox"
            disabled={!progress.assembled}
          />
          <span className={progress.shipped ? 'line-through text-gray-500' : ''}>
            Embarcado
          </span>
          {progress.shipped && <span className="text-blue-500">✓</span>}
        </label>

        {/* Checkpoints Customizados */}
        {progress.custom_checkpoints && progress.custom_checkpoints.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            {progress.custom_checkpoints.map((checkpoint, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={checkpoint.checked}
                  onChange={() => toggleCustomCheckpoint(index)}
                  className="checkbox"
                />
                <span className={checkpoint.checked ? 'line-through text-gray-500' : ''}>
                  {checkpoint.name}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Adicionar Checkpoint */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        {showAddCheckpoint ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCheckpoint}
              onChange={(e) => setNewCheckpoint(e.target.value)}
              placeholder="Nome do checkpoint..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && addCustomCheckpoint()}
            />
            <button
              onClick={addCustomCheckpoint}
              className="px-3 py-2 bg-primary text-white rounded-lg text-sm"
            >
              ✓
            </button>
            <button
              onClick={() => setShowAddCheckpoint(false)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm"
            >
              ✗
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCheckpoint(true)}
            className="text-sm text-primary hover:text-blue-700"
          >
            + Adicionar Checkpoint
          </button>
        )}
      </div>

      {/* Modal: Portas */}
      {showDoorsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Portas - Cab# {cab_number}</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleDoorsSelect('placed')}
                className="w-full py-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
              >
                Colocadas
              </button>
              <button
                onClick={() => handleDoorsSelect('packed')}
                className="w-full py-3 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
              >
                Embaladas
              </button>
            </div>
            <button
              onClick={() => setShowDoorsModal(false)}
              className="w-full mt-4 py-2 btn btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Embarque */}
      {showShippedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">🚚 Embarcar Peça</h3>
            <p className="text-gray-700 mb-4">
              Confirmar embarque de <strong>Cab# {cab_number}</strong>?
            </p>
            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <div>✓ Peça está montada</div>
              {progress.doors_status && <div>✓ Portas estão {progress.doors_status === 'placed' ? 'colocadas' : 'embaladas'}</div>}
              <div>✓ Pronta para transporte</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShippedModal(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmShipped}
                className="flex-1 btn btn-primary"
              >
                ✓ Embarcar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
