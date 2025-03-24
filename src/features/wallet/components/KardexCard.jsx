import React,{useState,useEffect} from "react";
import { useWallet } from "../WalletContext";
import provider from "../../../contracts/conecction/blockchainConnection";
import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import { ethers } from "ethers";

export const KardexCard = () => {
  const { walletData } = useWallet();
  const [wallet, setWallet] = useState(null)
  const [error, setError] = useState(null);

  useEffect(() => {
    if (walletData?.wallet) {
      try {
        let reconstructedWallet;
        if (!(walletData.wallet instanceof ethers.HDNodeWallet)) {
          if (walletData.wallet.mnemonic && walletData.wallet.mnemonic.phrase) {
            reconstructedWallet = ethers.HDNodeWallet.fromPhrase(
              walletData.wallet.mnemonic.phrase
            );
          } else {
            reconstructedWallet = new ethers.HDNodeWallet(
              walletData.wallet.privateKey, 
              walletData.wallet.publicKey, 
              walletData.wallet.address
            );
          }
        } else {
          reconstructedWallet = walletData.wallet;
        }
        setWallet(reconstructedWallet);
      } catch (err) {
        console.error("Error reconstruyendo wallet:", err);
        setError("No se pudo reconstruir la wallet");
      }
    }
  }, [walletData]);
  
  
  const handleReqestKardex = () =>{
    try {
      if (!wallet || !(wallet instanceof ethers.HDNodeWallet)) {
        throw new Error("Error al generar la wallet");
      }

      const contractAddressStudentManagement = 
        process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT;
      
      if (!provider) {
        throw new Error("No se pudo conectar a la blockchain");
      }
      
      const connectedWallet = wallet.connect(provider)
      const contract = new ethers.Contract(
        contractAddressStudentManagement,
        abiStudentManagement,
        connectedWallet
      );

      if (!contract) {
        throw new Error("No se pudo crear la instancia del contrato");
      }

      console.log("Contrato conectado correctamente:", contract);
    } catch (error) {
      console.error("Error en handleReqestKardex:", error);
      setError(error.message);
    }
  }

  return (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto bg-gradient-to-r from-green-200 to-yellow-100 w-16 h-16 rounded-full flex items-center justify-center shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="font-medium text-gray-800">Solicitar Nuevo Kardex</h3>
      <p className="text-sm text-gray-600 max-w-md mx-auto">
        Al solicitar un nuevo kardex, se generará un nuevo hash IPFS con tu información académica actualizada.
      </p>
      <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-200"
          onClick={handleReqestKardex}
      >
        Solicitar Kardex
      </button>
    </div>
  )
}

