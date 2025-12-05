'use client'

export default function EnvironmentTabs({ environments, activeIndex, onTabChange }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="flex">
          {environments.map((env, index) => (
            <button
              key={env.id}
              onClick={() => onTabChange(index)}
              className={`
                flex-1 min-w-[120px] px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${index === activeIndex
                  ? 'border-primary text-primary bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <div className="truncate">{env.name}</div>
              {env.progress && (
                <div className="text-xs mt-1">
                  {env.progress.shipped || '0/0'}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
