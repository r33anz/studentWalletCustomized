import React, { useState, useMemo } from "react";
import { useWallet } from "../WalletContext";
import { Modal } from "../../shared/components/Modal";

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

  const kardex = useMemo(() => {
    var k = nftInfo.data?.kardexInfo;
    if (!k) return { version: "", lastUpdated: 0, currentIpfsCid: "" };
    return {
      version: String(k.version ?? k[5] ?? ""),
      lastUpdated: Number(k.lastUpdated ?? k[2] ?? 0),
      currentIpfsCid: String(k.currentIpfsCid ?? k[3] ?? ""),
    };
  }, [nftInfo.data?.kardexInfo]);

  const openModal = () => setSelectedNFT(nftInfo.data);
  const closeModal = () => setSelectedNFT(null);

  const handleFileLinkClick = (url) => {
    window.open(url, "_blank");
  };

  if (nftInfo.error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400">{nftInfo.error}</p>
        </div>
      </div>
    );
  }

  const { data: nftData } = nftInfo;

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4 text-gray-800">Tu NFT Kardex</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          className="bg-surface-card border border-border rounded-2xl cursor-pointer hover:border-coral hover:shadow-elevated transition-all duration-200 overflow-hidden"
          onClick={openModal}
        >
          <div className="w-full aspect-square overflow-hidden">
            <img
              src={nftData.metadata.image}
              alt="NFT Kardex"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPk5GVCBJbWFnZTwvdGV4dD48L3N2Zz4=';
              }}
            />
          </div>

          <div className="p-3">
            <h4 className="font-medium text-sm text-gray-800 truncate">{nftData.metadata.name}</h4>
            <p className="text-xs text-gray-400 mt-1">
              V{kardex.version} • {new Date(kardex.lastUpdated * 1000).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {nftData.metadata.description.substring(0, 40)}...
            </p>
          </div>
        </div>
      </div>

      {selectedNFT && (
        <Modal onClose={closeModal} showCloseButton={false}>
          <h3 className="text-lg font-bold mb-4 text-gray-800">{selectedNFT.metadata.name}</h3>

          <div className="mb-4 rounded-xl overflow-hidden bg-surface">
            <img
              src={selectedNFT.metadata.image}
              alt="NFT Kardex"
              className="w-full h-auto max-h-64 object-contain mx-auto"
            />
          </div>

          <p className="mb-4 text-sm text-gray-500 text-left">{selectedNFT.metadata.description}</p>

          <div className="space-y-2 text-sm text-left">
            {selectedNFT.metadata.attributes?.map((attr, idx) => (
              <div key={idx} className="flex justify-between py-1 border-b border-border">
                <span className="font-medium text-gray-400">{attr.trait_type}:</span>
                <span className="text-gray-800">{attr.value}</span>
              </div>
            ))}
            <div className="flex justify-between py-1 border-b border-border">
              <span className="font-medium text-gray-400">Versión:</span>
              <span className="text-gray-800">{kardex.version}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-gray-400">CID Actual:</span>
              <span className="text-xs text-ocean break-all">{kardex.currentIpfsCid}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {selectedNFT.metadata.files?.access_url && (
              <button
                className="w-full px-5 py-3 rounded-xl font-semibold text-white bg-coral hover:bg-coral-light transition-all duration-200 text-sm"
                onClick={() => handleFileLinkClick(selectedNFT.metadata.files.access_url)}
              >
                Ver Archivos (MFS CID)
              </button>
            )}
            <button
              className="w-full px-5 py-3 rounded-xl font-semibold text-gray-600 bg-surface hover:bg-surface-hover border border-border transition-all duration-200 text-sm"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
});

NFTViewer.displayName = 'NFTViewer';
