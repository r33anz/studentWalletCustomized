import React, { useState, useMemo } from "react";
import { useWallet } from "../WalletContext";

export const NFTViewer = React.memo(() => {
  const { walletData } = useWallet();
  const [selectedNFT, setSelectedNFT] = useState(null);

  const nftInfo = useMemo(() => {
    const nftData = walletData?.nftData;
    
    if (!nftData) {
      return { 
        isLoading: false, 
        error: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex.", 
        data: null 
      };
    }

    if (!nftData.hasNFT) {
      return { 
        isLoading: false, 
        error: nftData.message || nftData.error || "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex.", 
        data: null 
      };
    }

    return { 
      isLoading: false, 
      error: null, 
      data: nftData 
    };
  }, [walletData?.nftData]);

  const openModal = () => setSelectedNFT(nftInfo.data);
  const closeModal = () => setSelectedNFT(null);

  const handleFileLinkClick = (url) => {
    window.open(url, "_blank");
  };

  
  if (nftInfo.error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">{nftInfo.error}</p>
        </div>
      </div>
    );
  }

  const { data: nftData } = nftInfo;

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Tu NFT Kardex</h3>
      <div className="bg-gray-50 p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow" onClick={openModal}>
        <img 
          src={nftData.metadata.image} 
          alt="NFT Kardex" 
          className="w-full h-32 object-cover mb-2 rounded"
          loading="lazy"
        />
        <h4 className="font-medium">{nftData.metadata.name}</h4>
        <p className="text-sm text-gray-600">
          Versión: {Number(nftData.kardexInfo.version)} | 
          Última actualización: {new Date(Number(nftData.kardexInfo.lastUpdated) * 1000).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">
          {nftData.metadata.description.substring(0, 50)}...
        </p>
      </div>

      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">{selectedNFT.metadata.name}</h3>
            <p className="mb-4">{selectedNFT.metadata.description}</p>
            <div className="space-y-2">
              {selectedNFT.metadata.attributes?.map((attr, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-medium">{attr.trait_type}:</span>
                  <span>{attr.value}</span>
                </div>
              ))}
              <div className="flex justify-between">
                <span className="font-medium">Versión:</span>
                <span>{Number(selectedNFT.kardexInfo.version)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CID Actual:</span>
                <span className="text-xs break-all">{selectedNFT.kardexInfo.currentIpfsCid}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              {selectedNFT.metadata.files?.access_url && (
                <button 
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
                  onClick={() => handleFileLinkClick(selectedNFT.metadata.files.access_url)}
                >
                  Ver Archivos (MFS CID)
                </button>
              )}
              <button 
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors" 
                onClick={closeModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

NFTViewer.displayName = 'NFTViewer';