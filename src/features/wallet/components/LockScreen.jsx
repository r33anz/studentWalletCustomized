import React, { useState } from "react";
import { Button } from "../../shared/components/Button";
import { PasswordInput } from "../../shared/components/PasswordInput";
import { Card } from "../../shared/components/Card";
import { ethers } from "ethers";

export var LockScreen = function ({ onUnlock, onLogout }) {
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [isLoading, setIsLoading] = useState(false);

  var handleUnlock = async function (e) {
    e.preventDefault();
    if (!password) { setError("Ingresa tu contraseña"); return; }

    setIsLoading(true);
    setError("");

    try {
      var encryptedWallet = localStorage.getItem("encryptedWallet");
      if (!encryptedWallet) {
        setError("No se encontró wallet guardada.");
        return;
      }

      await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
      setPassword("");
      onUnlock();
    } catch (err) {
      setError("Contraseña incorrecta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="mx-auto bg-warning-bg w-14 h-14 rounded-2xl flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Wallet Bloqueada</h2>
          <p className="text-sm text-gray-400 mt-1">Sesión bloqueada por inactividad</p>
        </div>

        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
            <PasswordInput
              value={password}
              onChange={function (e) { setPassword(e.target.value); setError(""); }}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              id="unlock-password"
            />
          </div>
          {error && <p className="text-danger text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-coral text-white hover:bg-coral-light" loading={isLoading}>
            Desbloquear
          </Button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-sm text-gray-400 hover:text-gray-700 transition-colors py-2"
          >
            Cerrar sesión
          </button>
        </form>
      </Card>
    </div>
  );
};
