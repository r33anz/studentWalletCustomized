import React from "react";
import { Button } from "../../shared/components/Button";

export const KardexCard = () => {
  return (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto bg-gradient-to-r from-green-200 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="font-medium text-gray-800">Solicitar Nuevo Kardex</h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        Al solicitar un nuevo kardex, se generará un nuevo hash IPFS con tu información académica actualizada.
      </p>
      <button className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-800 text-white rounded-full font-medium hover:from-orange-500 hover:to-red-500 transition-all duration-200">
        Solicitar Kardex
      </button>
    </div>
  )
}

