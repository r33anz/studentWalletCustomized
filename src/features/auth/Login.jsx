import React, { useState } from "react";
import { Button } from "../shared/components/Button";
import { Card } from "../shared/components/Card";
import { SeedPhraseModal } from "./components/SeedPhraseModal";
import { useNavigate } from "react-router-dom";
import { SetPasswordModal } from "./components/SetPasswordModal";


export default function Login() {
  const [isNewUser, setIsNewUser] = useState(true)
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [sisCode, setSisCode] = useState("");
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleExistingUserLogin = (e) => {
    e.preventDefault()
    console.log("SIS Code:", sisCode)
    console.log("Password:", password)
    navigate("/wallet")
  }

  const handleNewUserLogin = (e) => {
    e.preventDefault()
    console.log("SIS Code:", sisCode)
    setShowSeedModal(true)
  }

  const handleVerifySeedPhrase = () => {
    
    console.log("Frase Semilla:", seedPhrase.trim().split(" "))
    setShowSeedModal(false)
    setShowPasswordModal(true)
  }

  const handleSetPassword = () => {
    console.log("Nueva Contraseña:",newPassword)
    if(newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    navigate("/wallet")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-4">
      <Card className="w-[400px] min-h-[450px] flex flex-col">
        <div className="flex-1 p-6 flex flex-col">
          {/* Header - Siempre visible */}
          <div className="text-center mb-8">
            <div className="mx-auto bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-sm text-gray-500 mt-2">Accede a tu billetera digital</p>
          </div>

          {/* Selector de tipo de usuario */}
          <div className="flex mb-6 border rounded-md overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 text-center transition-colors ${
                isNewUser ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setIsNewUser(true)
                setError("")
              }}
            >
              Nuevo Usuario
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center transition-colors ${
                !isNewUser ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setIsNewUser(false)
                setError("")
              }}
            >
              Usuario Existente
            </button>
          </div>

          {/* Formularios */}
          {isNewUser ? (
            <form onSubmit={handleNewUserLogin} className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Código SIS"
                  value={sisCode}
                  onChange={(e) => setSisCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  Continuar
                </Button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Al continuar, se te pedirá ingresar tu frase semilla y establecer una contraseña
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleExistingUserLogin} className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Código SIS"
                  value={sisCode}
                  onChange={(e) => setSisCode(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full bg-orange-500 text-white hover:bg-orange-600">
                  Iniciar Sesión
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>

      {/* Modal para la frase semilla */}
      <SeedPhraseModal
        isOpen={showSeedModal}
        onClose={() => {
          setShowSeedModal(false)
          setError("")
        }}
        seedPhrase={seedPhrase}
        setSeedPhrase={setSeedPhrase}
        error={error}
        setError={setError}
        onVerify={handleVerifySeedPhrase}
      />
  
      {/* Modal para la contraseña */}  
      <SetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setError("")
        }}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        error={error}
        setError={setError}
        onSetPassword={handleSetPassword}
      />
    </div>
  );
}