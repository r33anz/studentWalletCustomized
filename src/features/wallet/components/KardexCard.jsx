import React,{useState,useEffect} from "react";
import { useWallet } from "../WalletContext";
import provider from "../../../contracts/conecction/blockchainConnection";
import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import { ethers } from "ethers";

export const KardexCard = () => {
  const { walletData } = useWallet();
  const [wallet, setWallet] = useState(null)
  const [sisCode, setSisCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

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

    if(walletData?.sisCode){
      setSisCode(walletData.sisCode)
      
    }
  }, [walletData]);
  
  
  const handleReqestKardex = async () =>{
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

      try {
        await contract.requestKardex(sisCode)
        setModalMessage("¡Solicitud de kardex enviada con éxito! Su hash IPFS será actualizado pronto.");
        setModalType("success");
        setShowModal(true);
      } catch (error) {
        console.error(error)
        setModalMessage(`Error al solicitar kardex: ${error.message || "Revise la consola para más detalles"}`);
        setModalType("error");
        setShowModal(true);
      }

    } catch (error) {
      console.error("Error en handleReqestKardex:", error);
      setError(error.message);
      setModalMessage(`Error: ${error.message}`);
      setModalType("error");
      setShowModal(true);
    }finally {
      setIsLoading(false);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              {modalType === "success" ? (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              <h3
                className={`mt-4 text-lg font-medium ${
                  modalType === "success" ? "text-green-900" : "text-red-900"
                }`}
              >
                {modalType === "success" ? "¡Operación Exitosa!" : "Error"}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{modalMessage}</p>
              <div className="mt-6">
                <button
                  type="button"
                  className={`inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                    modalType === "success"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-red-500 hover:bg-red-600"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    modalType === "success"
                      ? "focus:ring-orange-500"
                      : "focus:ring-red-500"
                  } transition-colors duration-200`}
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

