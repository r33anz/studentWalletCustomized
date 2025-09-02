import React,{useState,useEffect} from "react";
import { useWallet } from "../WalletContext";
import provider from "../../../contracts/conecction/blockchainConnection";
import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import { ethers } from "ethers";
import { PriceOracleService } from "../services/oracleService";

export const KardexCard = () => {
  const { walletData, balance, refreshWalletData } = useWallet();
  const [wallet, setWallet] = useState(null);
  const [sisCode, setSisCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");
  const [requiredEth, setRequiredEth] = useState("0");
  const [ethPrice, setEthPrice] = useState("0");

  const TX_COST_IN_USD = process.env.REACT_APP_TX_COST_USD || 2;

  useEffect(() => {
    if (walletData?.wallet) {
      setWallet(walletData.wallet);
    }
    if (walletData?.sisCode) {
      setSisCode(walletData.sisCode);
    }
  }, [walletData]);
  
  useEffect(() => {
    const fetchEthPrice = async () => {
      if (!wallet) return;
      
      try {
        const oracle = new PriceOracleService(provider);
        const price = await oracle.getEthPriceInUSD();
        setEthPrice(price.toFixed(2));
        
        // Calcular ETH requeridos
        const required = await oracle.calculateRequiredEth(TX_COST_IN_USD);
        setRequiredEth(required.toFixed(6));
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setModalMessage("Error al obtener el precio de ETH");
        setModalType("error");
        setShowModal(true);
      }
    };

    fetchEthPrice();
  }, [wallet, TX_COST_IN_USD]);

  const handleRequestConfirmation = () => {
    if (Number(requiredEth) <= 0) {
      setModalMessage("Esperando datos de conversión...");
      setModalType("error");
      setShowModal(true);
      return;
    }
    setShowConfirmationModal(true);
  };

  const handleCancelTransaction = () => {
    setShowConfirmationModal(false);
  };

  const handleConfirmTransaction = async () => {
    setShowConfirmationModal(false);
    setIsLoading(true);
    try {
      await handleRequestKardex();
      setModalMessage("¡Solicitud enviada! Pronto recivira su nuevo NFT Kardex.");
      setModalType("success");
      await refreshWalletData();
    } catch (error) {
      setModalMessage(`Error: ${error.reason || error.message}`);
      setModalType("error");
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };
  
  const handleRequestKardex = async () => {
    if (!wallet || !(wallet instanceof ethers.HDNodeWallet)) {
      throw new Error("Error al generar la wallet");
    }

    const requiredWei = ethers.parseEther(requiredEth);
    const currentBalance = await provider.getBalance(wallet.address);
    if (currentBalance < requiredWei) {
      throw new Error(`Saldo insuficiente. Necesitas al menos ${requiredEth} ETH ($${TX_COST_IN_USD} USD)`);
    }

    const contractAddressStudentManagement = 
      process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT;
    
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(
      contractAddressStudentManagement,
      abiStudentManagement,
      connectedWallet
    );

    const tx = await contract.requestKardex(sisCode, { 
      value: requiredWei 
    });
    
    await tx.wait();
  };


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
      <button 
        className="px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors duration-200"
        onClick={handleRequestConfirmation}
        disabled={isLoading}
      >
        {isLoading ? "Procesando..." : "Solicitar Kardex"}
      </button>

      {/* Modal de Confirmación */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Confirmar Solicitud de Kardex
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                ¿Estás seguro que deseas solicitar un nuevo kardex? 
                Esta operación tendrá un costo de <span className="font-bold">{TX_COST_IN_USD} USD</span>.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  onClick={handleCancelTransaction}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                  onClick={handleConfirmTransaction}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Resultado */}
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
  );
}

