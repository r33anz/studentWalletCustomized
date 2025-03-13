import React from "react";
import { Button } from "../../shared/components/Button";    

export const SetPasswordModal = ({
    isOpen,
    onClose,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    onSetPassword,
  }) => {
    if (!isOpen) return null
  
    const handleSubmit = (e) => {
      e.preventDefault()
      onSetPassword()
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold">Configura tu Contraseña</h3>
            <p className="text-sm text-gray-500 mt-1">Crea una contraseña segura para acceder a tu billetera</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
  
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Repite tu contraseña"
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
                Finalizar
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }