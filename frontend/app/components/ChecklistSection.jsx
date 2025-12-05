'use client'

import { useState } from 'react'
import ChecklistItem from './ChecklistItem'

export default function ChecklistSection({ title, icon, color, pieces, onUpdate }) {
  const [expanded, setExpanded] = useState(true)

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    gray: 'bg-gray-50 border-gray-200'
  }

  return (
    <div className={`card ${colorClasses[color] || ''}`}>
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-bold flex items-center">
          <span className="mr-2">{icon}</span>
          {title} ({pieces.length})
        </h3>
        <svg
          className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Content */}
      {expanded && (
        <div className="mt-4 space-y-4">
          {pieces.map(piece => (
            <ChecklistItem key={piece.id} piece={piece} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
