import React from "react";
import { Button } from "../../shared/components/Button";

var inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-surface-input text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-coral focus:border-coral transition-all duration-200";

export var SeedPhraseStep = function ({ seedPhrase, onSeedPhraseChange, seedWordCount, error, onSubmit, isLoading }) {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col">
      <div className="flex-1 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="seedPhrase" className="block text-sm font-medium text-gray-600">
              Frase Semilla
            </label>
            <span className={"text-xs " + (seedWordCount === 12 ? "text-success" : seedWordCount > 0 ? "text-coral" : "text-gray-400")}>
              {seedWordCount}/12 palabras
            </span>
          </div>
          <textarea
            id="seedPhrase"
            value={seedPhrase}
            onChange={onSeedPhraseChange}
            className={inputClass + " h-28 resize-none"}
            placeholder="Ingresa las 12 palabras separadas por espacios"
            required
            disabled={isLoading}
            autoComplete="off"
            spellCheck="false"
          />
          {error && <p className="text-danger text-sm mt-1">{error}</p>}
        </div>
        <div className="bg-warning-bg border border-border rounded-xl p-3">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xs text-gray-500">
              Nunca compartas tu frase semilla. Quien la tenga puede acceder a tu billetera.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Button
          type="submit"
          className="w-full bg-coral text-white hover:bg-coral-light"
          loading={isLoading}
          disabled={seedWordCount !== 12}
        >
          Verificar Frase
        </Button>
      </div>
    </form>
  );
};
