import React from "react"
import { Icon } from "../../shared/components/Icon"
import { Clipboard } from "lucide-react"

export const WalletHeader = ({ walletAddress, balance, onCopyAddress }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-3 rounded-full shadow-md">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800">Billetera estudiantil</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{walletAddress}</span>
              <Icon icon={Clipboard} onClick={onCopyAddress} className="text-gray-400 hover:text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-400 px-6 py-3 rounded-full shadow-md">
          <span className="font-bold text-white">{balance}</span>
        </div>
      </div>
    </div>
  )
}

