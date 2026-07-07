import React from "react";
import { Button } from "../../shared/components/Button";
import { PasswordInput } from "../../shared/components/PasswordInput";

var inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-surface-input text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral transition-all duration-200";

export var ExistingUserForm = function ({ sisCode, password, onSisCodeChange, onPasswordChange, error, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Código SIS</label>
          <input
            type="text"
            placeholder="Ingresa tu código SIS"
            value={sisCode}
            onChange={onSisCodeChange}
            className={inputClass}
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña</label>
          <PasswordInput
            value={password}
            onChange={onPasswordChange}
            placeholder="Ingresa tu contraseña"
            disabled={isLoading}
            id="login-password"
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>
      <div className="mt-6">
        <Button type="submit" className="w-full bg-coral text-white hover:bg-coral-light" loading={isLoading}>
          Iniciar Sesión
        </Button>
      </div>
    </form>
  );
};
