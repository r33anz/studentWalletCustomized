const ERROR_MESSAGES = {
  NETWORK: "Error de conexión. Verifica tu internet e intenta de nuevo.",
  TIMEOUT: "La solicitud tardó demasiado. Intenta de nuevo.",
  IPFS: "No se pudieron cargar los datos del NFT. El servidor IPFS podría no estar disponible.",
  CONTRACT_REVERTED: "La transacción fue rechazada por el contrato. Verifica los datos e intenta de nuevo.",
  INSUFFICIENT_FUNDS: "Saldo insuficiente para completar la operación.",
  USER_REJECTED: "Operación cancelada.",
  INVALID_WALLET: "Wallet no válida. Cierra sesión e ingresa de nuevo.",
  NO_WALLET_FOUND: "No se encontró una wallet guardada. Ingresa como nuevo usuario.",
  WRONG_CREDENTIALS: "Código SIS o contraseña incorrectos.",
  INVALID_SEED: "Frase semilla inválida. Verifica las 12 palabras.",
  CONTRACT_CONNECTION: "No se pudo conectar con el contrato. Intenta de nuevo.",
  UNKNOWN: "Ocurrió un error inesperado. Intenta de nuevo.",
};

export function getUserFriendlyError(error) {
  const msg = error?.message || error?.reason || "";
  const lower = msg.toLowerCase();

  if (lower.includes("failed to fetch") || lower.includes("networkerror") || lower.includes("network request failed")) {
    return ERROR_MESSAGES.NETWORK;
  }
  if (lower.includes("timeout") || lower.includes("aborted")) {
    return ERROR_MESSAGES.TIMEOUT;
  }
  if (lower.includes("metadata") || lower.includes("ipfs")) {
    return ERROR_MESSAGES.IPFS;
  }
  if (lower.includes("execution reverted") || lower.includes("call_exception")) {
    return ERROR_MESSAGES.CONTRACT_REVERTED;
  }
  if (lower.includes("insufficient funds") || lower.includes("saldo insuficiente")) {
    return ERROR_MESSAGES.INSUFFICIENT_FUNDS;
  }
  if (lower.includes("user rejected") || lower.includes("action_rejected")) {
    return ERROR_MESSAGES.USER_REJECTED;
  }
  if (lower.includes("no se encontró wallet encriptada")) {
    return ERROR_MESSAGES.NO_WALLET_FOUND;
  }

  return ERROR_MESSAGES.UNKNOWN;
}

export { ERROR_MESSAGES };
