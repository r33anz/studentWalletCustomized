import React, { useEffect, useState } from "react";
import { Button } from "../shared/components/Button";
import { Card } from "../shared/components/Card";
import { SeedPhraseModal } from "./components/SeedPhraseModal";
import { useNavigate } from "react-router-dom";
import { SetPasswordModal } from "./components/SetPasswordModal";
import LoginService from "./services/LoginService";
import { keccak256,toUtf8Bytes,Wallet } from "ethers";
import { ethers } from "ethers";
import provider from "../../contracts/conecction/blockchainConnection";
import abiKardexNFT from "../../contracts/abi/abiKardexNFT";

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
  const [wallet, setWallet] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    
  }, [wallet])

  const fetchNFTData = async (walletAddress) => {
    console.time('fetchNFTData_total');
    try {
      console.time('contract_connection');
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT;
      const nftContract = new ethers.Contract(contractAddress, abiKardexNFT, provider);

      const hasNft = await nftContract.hasKardex(walletAddress);
      if (!hasNft) {
        return { hasNFT: false, message: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex." };
      }

      console.time('token_data_fetch');
      const [tokenId, kardexInfo] = await Promise.all([
        nftContract.studentToToken(walletAddress),
        nftContract.getStudentKardex(walletAddress)
      ]);

      const tokenURI = await nftContract.tokenURI(tokenId);

      let cid = tokenURI.replace(`${process.env.REACT_APP_IPFS_GATEWAY}`, "");
      if (tokenURI.startsWith("ipfs://")) cid = tokenURI.replace("ipfs://", "");
      
      const response = await fetch(`${process.env.REACT_APP_IPFS_GATEWAY}${cid}`);

      if (!response.ok) throw new Error("Error fetching metadata");
      const metadata = await response.json();

      console.timeEnd('fetchNFTData_total');
      return { 
        hasNFT: true,
        tokenId: Number(tokenId), 
        metadata, 
        kardexInfo,
        loadedAt: Date.now()
      };
    } catch (err) {
      console.error("Error fetching NFT data:", err);
      return { hasNFT: false, error: err.message };
    }
  };

  const handleExistingUserLogin = async (e) => {
    e.preventDefault()
    const walletRecovered = await recoverWalletfromLocalStorage(password)
    
    if (!walletRecovered || !(walletRecovered instanceof ethers.HDNodeWallet)) {
      throw new Error("Error al generar la wallet");
    }

    const contractStudentManagementToGetData =
    LoginService.connectToManagementCredentialContractToSetData(walletRecovered);

    if (!contractStudentManagementToGetData) {
      console.log("Error: No se pudo conectar con el contrato.");
      return;
    }

    try {
      
      const [passwordRecovered, address, balance, nftData] = await Promise.all([
        contractStudentManagementToGetData.getStudentPassword(sisCode),
        contractStudentManagementToGetData.getStudentAddressBySISCode(sisCode),
        LoginService.getBalance(walletRecovered.address),
        fetchNFTData(walletRecovered.address) 
      ]);

      if(passwordRecovered !== keccak256(toUtf8Bytes(password))) {
        setError("Código SIS o contraseña incorrectos") 
        return
      }   

      navigate("/wallet", {
        state: {    
          wallet:walletRecovered,
          balance: balance,
          sisCode:sisCode,
          nftData:nftData,
          preloaded: true
        }
      });
                                                   
    } catch (error) {       
        console.error("Error al recuperar el código SIS:", error);
    }
    
  }

  const handleNewUserLogin = (e) => {
    e.preventDefault()
    setShowSeedModal(true)
  }

  const  handleVerifySeedPhrase =async () => {

    const arrText = LoginService.splitPhrase(seedPhrase)
    
    if(!LoginService.countWords(arrText)){
      setError("La frase semilla debe tener 12 palabras")
      return
    }
    const rebuiltPhrase = LoginService.rebuildPhrase(arrText)
    const walletGenerated = 
    LoginService.getWalletAndPKFromMnemonicPhrase(rebuiltPhrase)
    setWallet(walletGenerated)

    if (!walletGenerated || !(walletGenerated instanceof ethers.HDNodeWallet)) {
      throw new Error("Error al generar la wallet");
    }
    
    const contractStudentManagementToGetData =
    LoginService.connectToManagementCredentialContractToGetData();

    if (!contractStudentManagementToGetData) {
      console.log("Error: No se pudo conectar con el contrato.");
      return;
    }
    setShowSeedModal(false)
    setShowPasswordModal(true)
  }

  const handleSetPassword = async() => {
    
    if(newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    const contractStudentManagementToSetData =
    LoginService.connectToManagementCredentialContractToSetData(wallet);

    if (!contractStudentManagementToSetData) {
      console.log("Error: No se pudo conectar con el contrato.");   
      return;
    } 

    try {
      encryptWalletAndSAfe(wallet,newPassword)
    
      const [address, balance, nftData] = await Promise.all([
        contractStudentManagementToSetData.getStudentAddressBySISCode(sisCode),
        LoginService.getBalance(wallet.address),
        fetchNFTData(wallet.address)
      ]);

      const passwordHash = keccak256(toUtf8Bytes(newPassword));
      await contractStudentManagementToSetData.setStudentPassword(sisCode, passwordHash);

      navigate("/wallet", {
        state: {
          wallet: wallet,
          balance: balance,
          sisCode: sisCode,
          nftData: nftData,
          preloaded: true
        }
      });
    } catch (error) {
      console.error("Error setting password:", error);
      setError("Error al establecer la contraseña");
    }
  }

  const encryptWalletAndSAfe = async (newWallet,password) =>{
    const encryptedWallet = await  newWallet.encrypt(password)
    localStorage.setItem("encryptedWallet",encryptedWallet)
  }

  const recoverWalletfromLocalStorage = async (password) => {
    try {
      const encryptedWallet = localStorage.getItem("encryptedWallet");
      const walletT = await Wallet.fromEncryptedJson(encryptedWallet, password);
      
      let hdWallet;
      if (!(walletT instanceof ethers.HDNodeWallet)) {
        hdWallet = ethers.HDNodeWallet.fromPhrase(walletT.mnemonic.phrase);
      } else {
        hdWallet = walletT;
      }
      
      return hdWallet;
    } catch (error) {
      console.error("Error recuperando wallet:", error);
      throw error;
    }
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