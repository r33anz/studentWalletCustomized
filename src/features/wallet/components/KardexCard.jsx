import React, { useState } from "react";
import { useWallet } from "../WalletContext";
import { Button } from "../../shared/components/Button";
import { Modal, ModalIcon } from "../../shared/components/Modal";
import WalletService from "../services/WalletService";
import { getUserFriendlyError } from "../../shared/utils/errorHandler";

var TX_FEE_ETH = process.env.REACT_APP_TX_FEE_ETH || "0.001";

export var KardexCard = function () {
  var { walletData, refreshWalletData, hasActiveRequest, setHasActiveRequest } = useWallet();
  var [isLoading, setIsLoading] = useState(false);
  var [showResultModal, setShowResultModal] = useState(false);
  var [showConfirmModal, setShowConfirmModal] = useState(false);
  var [modalMessage, setModalMessage] = useState("");
  var [modalType, setModalType] = useState("success");

  var wallet = walletData?.wallet;
  var sisCode = walletData?.sisCode || "";

  var handleConfirmTransaction = async function () {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      var service = new WalletService(wallet);
      await service.requestKardex(sisCode);

      setModalMessage("¡Solicitud enviada! Pronto recibirás tu nuevo NFT Kardex.");
      setModalType("success");
      setHasActiveRequest(true);
      await refreshWalletData();
    } catch (err) {
      console.error("[Kardex Request Error]", err);
      setModalMessage(getUserFriendlyError(err));
      setModalType("error");
    } finally {
      setIsLoading(false);
      setShowResultModal(true);
    }
  };

  if (hasActiveRequest) {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="mx-auto bg-warning-bg w-16 h-16 rounded-2xl flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-medium text-gray-800">Solicitud en Proceso</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Tu solicitud de kardex está siendo procesada. Por favor espera a que el administrador genere tu nuevo NFT Kardex.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-warning-bg border border-warning rounded-xl">
          <svg className="animate-spin h-5 w-5 text-warning mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-medium text-warning">En espera</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-center space-y-4">
      <div className="mx-auto bg-coral-bg w-16 h-16 rounded-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="font-medium text-gray-800">Solicitar Nuevo Kardex</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        Al solicitar un nuevo kardex, se generará un nuevo hash IPFS con tu información académica actualizada.
      </p>
      <p className="text-xs text-gray-400">
        Costo de transacción: <span className="text-warning font-medium">{TX_FEE_ETH} BNB</span>
      </p>

      <Button
        className="bg-coral text-white hover:bg-coral-light"
        onClick={function () { setShowConfirmModal(true); }}
        loading={isLoading}
      >
        Solicitar Kardex
      </Button>

      {showConfirmModal && (
        <Modal onClose={function () { setShowConfirmModal(false); }} showCloseButton={false}>
          <ModalIcon type="warning" />
          <h3 className="mt-4 text-lg font-medium text-gray-800">Confirmar Solicitud</h3>
          <p className="mt-2 text-sm text-gray-500">
            ¿Estás seguro que deseas solicitar un nuevo kardex?
            Costo: <span className="font-bold text-warning">{TX_FEE_ETH} BNB</span>
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              type="button"
              className="text-gray-600 bg-surface hover:bg-surface-hover border border-border"
              onClick={function () { setShowConfirmModal(false); }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-coral text-white hover:bg-coral-light"
              onClick={handleConfirmTransaction}
              loading={isLoading}
            >
              Confirmar
            </Button>
          </div>
        </Modal>
      )}

      {showResultModal && (
        <Modal onClose={function () { setShowResultModal(false); }}>
          <ModalIcon type={modalType} />
          <h3 className={"mt-4 text-lg font-medium " + (modalType === "success" ? "text-success" : "text-danger")}>
            {modalType === "success" ? "¡Operación Exitosa!" : "Error"}
          </h3>
          <p className="mt-2 text-sm text-gray-500">{modalMessage}</p>
        </Modal>
      )}
    </div>
  );
};
