import React from "react";
import { Button } from "../../shared/components/Button";

export const SeedPhraseModal = ({ isOpen, onClose, seedPhrase, 
                        setSeedPhrase, error, setError, onVerify }) => {
    if (!isOpen) return null
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onVerify()
    }
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <div className="text-center mb-6">
            <div className="mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Verificación de Seguridad</h3>
            <p className="text-sm text-gray-500 mt-1">Ingresa tu frase semilla para acceder a tu billetera</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="seedPhrase" className="block text-sm font-medium text-gray-700 mb-1">
                Frase Semilla
              </label>
              <textarea
                id="seedPhrase"
                value={seedPhrase}
                onChange={(e) => {
                  setSeedPhrase(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 h-24"
                placeholder="Ingresa tu frase semilla (12 palabras separadas por espacios)"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
  
            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
              >
                Verificar
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }