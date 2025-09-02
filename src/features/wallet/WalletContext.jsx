import React, { useState, useContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import provider from "../../contracts/conecction/blockchainConnection";
import abiKardexNFT from "../../contracts/abi/abiKardexNFT";

const WalletContext = React.createContext();
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);
  const [balance, setBalance] = useState("0 ETH");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const reconstructWallet = useCallback((wallet) => {
    try {
      let reconstructedWallet;
      if (!(wallet instanceof ethers.HDNodeWallet)) {
        if (wallet.mnemonic && wallet.mnemonic.phrase) {
          reconstructedWallet = ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase);
        } else {
          reconstructedWallet = new ethers.HDNodeWallet(
            wallet.privateKey,
            wallet.publicKey,
            wallet.address
          );
        }
      } else {
        reconstructedWallet = wallet;
      }
      return reconstructedWallet;
    } catch (err) {
      console.error("Error reconstruyendo wallet:", err);
      throw new Error("No se pudo reconstruir la wallet");
    }
  }, []);

  const refreshWalletData = useCallback(async () => {
    if (!walletData?.wallet || !walletData?.sisCode) return;

    setIsRefreshing(true);
    try {
        const wallet = reconstructWallet(walletData.wallet);
        const connectedWallet = wallet.connect(provider);

        // Actualizar balance
        const newBalance = await provider.getBalance(connectedWallet.address);
        const formattedBalance = ethers.formatEther(newBalance);
        const nftData = await fetchNFTData(wallet.address);

        setWalletData((prev) => ({
            ...prev,
            nftData,
            lastRefreshed: Date.now(),
        }));

        setBalance(`${formattedBalance} ETH`);

        return {
            balance: formattedBalance,
        };
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [walletData, reconstructWallet]);

  const fetchNFTData = useCallback(async (walletAddress) => {
    console.time('fetchNFTData_total');
    try {
        console.time('contract_connection');
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT;
        const nftContract = new ethers.Contract(contractAddress, abiKardexNFT, provider);
        console.timeEnd('contract_connection');

        console.time('hasKardex_check');
        const hasNft = await nftContract.hasKardex(walletAddress);
        console.timeEnd('hasKardex_check');
        
        if (!hasNft) return { hasNFT: false, message: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex." };

        console.time('token_data_fetch');
        const [tokenId, kardexInfo, tokenURI] = await Promise.all([
        nftContract.studentToToken(walletAddress),
        nftContract.getStudentKardex(walletAddress),
        nftContract.tokenURI(tokenId)
        ]);
        console.timeEnd('token_data_fetch');

        console.time('ipfs_processing');
        let cid = tokenURI.replace(`${process.env.REACT_APP_IPFS_GATEWAY}`, "");
        if (tokenURI.startsWith("ipfs://")) cid = tokenURI.replace("ipfs://", "");
        console.timeEnd('ipfs_processing');

        console.time('metadata_fetch');
        const response = await fetch(`${process.env.REACT_APP_IPFS_GATEWAY}${cid}`);
        if (!response.ok) throw new Error("Error fetching metadata");
        const metadata = await response.json();
        console.timeEnd('metadata_fetch');

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
        console.timeEnd('fetchNFTData_total');
        return { hasNFT: false, error: err.message };
    }
    }, []);

  useEffect(() => {
    const initialize = async () => {
      if (location.state && location.state.wallet) {
        try {
          const wallet = reconstructWallet(location.state.wallet);
          const connectedWallet = wallet.connect(provider);
          const initialBalance = await provider.getBalance(connectedWallet.address);

          setWalletData({
            ...location.state,
            wallet, 
            lastRefreshed: Date.now(), 
          });

          setBalance(`${ethers.formatEther(initialBalance)} ETH`);

          await refreshWalletData();
        } catch (err) {
          console.error("Error inicializando wallet:", err);
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    initialize();
  }, [location, navigate, reconstructWallet, ]);

  return (
    <WalletContext.Provider
      value={{
        walletData,
        setWalletData,
        balance,
        refreshWalletData,
        isRefreshing,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};