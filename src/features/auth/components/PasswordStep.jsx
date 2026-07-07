import React from "react";
import { Button } from "../../shared/components/Button";
import { PasswordInput } from "../../shared/components/PasswordInput";
import { PasswordStrength } from "../../shared/components/PasswordStrength";

export var PasswordStep = function ({ newPassword, confirmPassword, onNewPasswordChange, onConfirmPasswordChange, error, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="flex-1 space-y-4">
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">
            Nueva Contraseña
          </label>
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={onNewPasswordChange}
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
          />
          <PasswordStrength password={newPassword} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
            Confirmar Contraseña
          </label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
      </div>
      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-coral text-white hover:bg-coral-light"
          loading={isLoading}
          disabled={!newPassword || !confirmPassword || newPassword.length < 6}
        >
          Crear Billetera
        </Button>
      </div>
    </form>
  );
};
