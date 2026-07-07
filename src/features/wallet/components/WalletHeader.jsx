import React from "react";
import { Icon } from "../../shared/components/Icon";
import { Clipboard, LogOut, ExternalLink } from "lucide-react";

export var WalletHeader = function ({ walletAddress, balance, onCopyAddress, onLogout }) {
  return (
    <div className="bg-surface-card border border-border rounded-2xl p-6 shadow-card overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-coral p-3 rounded-2xl flex-shrink-0">
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
          <div className="min-w-0">
            <h2 className="font-bold text-gray-800">Billetera estudiantil</h2>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span className="truncate">{walletAddress}</span>
              <Icon icon={Clipboard} onClick={onCopyAddress} label="Copiar dirección" />
              <a
                href={"https://testnet.bscscan.com/address/" + walletAddress}
                target="_blank"
                rel="noopener noreferrer"
                title="Ver en BSCScan"
                className="p-2 hover:bg-surface-hover rounded-lg transition-colors duration-200 flex-shrink-0"
              >
                <ExternalLink className="w-5 h-5 text-gray-400 hover:text-ocean transition-colors duration-200" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-ocean-bg border border-ocean px-5 py-2 rounded-xl">
            <span className="font-bold text-ocean">{balance}</span>
          </div>
          <Icon icon={LogOut} onClick={onLogout} label="Cerrar sesión" iconClassName="w-5 h-5 text-danger hover:text-danger-light transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
};
