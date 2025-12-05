'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Summary from '../../components/Summary'
import EnvironmentTabs from '../../components/EnvironmentTabs'
import ChecklistSection from '../../components/ChecklistSection'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ClientPage() {
  const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeEnvironment, setActiveEnvironment] = useState(0)

  useEffect(() => {
    fetchClient()
  }, [params.id])

  const fetchClient = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/clients/${params.id}`)
      setClient(response.data)
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Tem certeza que deseja arquivar este projeto?')) return

    try {
      await axios.put(`${API_URL}/clients/${params.id}/archive`, {
        archived: true
      })
      router.push('/')
    } catch (error) {
      console.error('Erro ao arquivar:', error)
      alert('Erro ao arquivar projeto')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Cliente não encontrado</h2>
          <button onClick={() => router.push('/')} className="btn btn-primary">
            Voltar
          </button>
        </div>
      </div>
    )
  }

  const currentEnvironment = client.environments[activeEnvironment]

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-mobile py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{client.name}</h1>
              {client.job_name && (
                <p className="text-sm text-gray-600">{client.job_name}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Summary */}
      <div className="container-mobile mt-6">
        <Summary client={client} onArchive={handleArchive} />
      </div>

      {/* Environment Tabs */}
      {client.environments.length > 0 && (
        <>
          <div className="container-mobile mt-6">
            <EnvironmentTabs
              environments={client.environments}
              activeIndex={activeEnvironment}
              onTabChange={setActiveEnvironment}
            />
          </div>

          {/* Environment Content */}
          <div className="container-mobile mt-6">
            {currentEnvironment && (
              <div className="space-y-6">
                {/* Environment Info */}
                <div className="card">
                  <h2 className="text-lg font-bold mb-2">{currentEnvironment.name}</h2>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    {currentEnvironment.date && <span>📅 {currentEnvironment.date}</span>}
                    {currentEnvironment.material && <span>📦 {currentEnvironment.material}</span>}
                  </div>
                </div>

                {/* Gabinetes */}
                {currentEnvironment.pieces.cabinets.length > 0 && (
                  <ChecklistSection
                    title="Gabinetes"
                    icon="📦"
                    color="blue"
                    pieces={currentEnvironment.pieces.cabinets}
                    onUpdate={fetchClient}
                  />
                )}

                {/* Peças Especiais */}
                {currentEnvironment.pieces.special.length > 0 && (
                  <ChecklistSection
                    title="Peças Especiais"
                    icon="⭐"
                    color="yellow"
                    pieces={currentEnvironment.pieces.special}
                    onUpdate={fetchClient}
                  />
                )}

                {/* Legs */}
                {currentEnvironment.materials.legs.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <span className="mr-2">⚙️</span>
                      Legs (Pés de Gabinete)
                    </h3>
                    <div className="space-y-3">
                      {currentEnvironment.materials.legs.map(leg => (
                        <div key={leg.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={leg.installed}
                            onChange={(e) => updateMaterial(leg.id, e.target.checked)}
                            className="checkbox"
                          />
                          <span className={leg.installed ? 'line-through text-gray-500' : ''}>
                            {leg.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hinges */}
                {currentEnvironment.materials.hinges.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-bold mb-4 flex items-center">
                      <span className="mr-2">🔩</span>
                      Hinges (Dobradiças)
                    </h3>
                    <div className="space-y-3">
                      {currentEnvironment.materials.hinges.map(hinge => (
                        <div key={hinge.id} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={hinge.installed}
                            onChange={(e) => updateMaterial(hinge.id, e.target.checked)}
                            className="checkbox"
                          />
                          <span className={hinge.installed ? 'line-through text-gray-500' : ''}>
                            {hinge.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Peças Avulsas */}
                {currentEnvironment.pieces.loose.length > 0 && (
                  <ChecklistSection
                    title="Peças Avulsas"
                    icon="🔧"
                    color="gray"
                    pieces={currentEnvironment.pieces.loose}
                    onUpdate={fetchClient}
                  />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )

  async function updateMaterial(materialId, installed) {
    try {
      await axios.put(`${API_URL}/materials/${materialId}/progress`, {
        installed
      })
      fetchClient()
    } catch (error) {
      console.error('Erro ao atualizar material:', error)
    }
  }
}
