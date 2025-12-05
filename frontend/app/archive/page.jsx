'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ClientCard from '../components/ClientCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function ArchivePage() {
  const router = useRouter()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArchivedClients()
  }, [])

  const fetchArchivedClients = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/clients?archived=true`)
      setClients(response.data)
    } catch (error) {
      console.error('Erro ao carregar clientes arquivados:', error)
    } finally {
      setLoading(false)
    }
  }

  const unarchiveClient = async (clientId) => {
    try {
      await axios.put(`${API_URL}/clients/${clientId}/archive`, {
        archived: false
      })
      fetchArchivedClients()
    } catch (error) {
      console.error('Erro ao desarquivar:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-xl font-bold">📁 Clientes Arquivados</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-mobile mt-6 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente arquivado</h3>
            <p className="text-gray-600">Projetos finalizados aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map(client => (
              <div key={client.id} className="relative">
                <ClientCard client={client} />
                <div className="mt-2">
                  <button
                    onClick={() => unarchiveClient(client.id)}
                    className="w-full py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Desarquivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
