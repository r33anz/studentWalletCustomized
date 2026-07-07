export function validateSisCode(code) {
  if (!code || !code.trim()) return "Ingresa tu código SIS";
  if (code.trim().length < 3) return "El código SIS debe tener al menos 3 caracteres";
  return null;
}

export function normalizeSeedPhrase(phrase) {
  if (!phrase || typeof phrase !== "string") return "";
  return phrase.trim().replace(/\s+/g, " ");
}

export function validateSeedPhrase(phrase) {
  if (!phrase || !phrase.trim()) return "Ingresa tu frase semilla";
  var words = normalizeSeedPhrase(phrase).split(" ");
  if (words.length !== 12) return "La frase semilla debe tener exactamente 12 palabras (tienes " + words.length + ")";
  return null;
}

export function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };
  if (password.length < 6) return { level: 1, label: "Muy débil", color: "bg-danger" };

  var score = 1;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  var capped = Math.min(score, 4);

  var labels = { 1: "Débil", 2: "Regular", 3: "Buena", 4: "Fuerte" };
  var colors = { 1: "bg-danger", 2: "bg-coral", 3: "bg-ocean", 4: "bg-success" };

  return { level: capped, label: labels[capped], color: colors[capped] };
}

export function validatePassword(password) {
  if (!password) return "Ingresa una contraseña";
  if (password.length < 6) return "Mínimo 6 caracteres";
  return null;
}

export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) return "Confirma tu contraseña";
  if (password !== confirmPassword) return "Las contraseñas no coinciden";
  return null;
}
