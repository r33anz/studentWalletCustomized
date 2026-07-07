import React, { useState, useContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import provider from "../../contracts/connection/blockchainConnection";
import WalletService from "./services/WalletService";
import { fetchNFTData } from "../shared/services/NFTService";

var WalletContext = React.createContext();
export var useWallet = function () { return useContext(WalletContext); };

export var WalletProvider = function ({ children }) {
  var [walletData, setWalletData] = useState(null);
  var [isRefreshing, setIsRefreshing] = useState(false);
  var [hasActiveRequest, setHasActiveRequest] = useState(false);
  var navigate = useNavigate();
  var location = useLocation();

  var balance = walletData ? walletData.balance + " BNB" : "0 BNB";

  var reconstructWallet = useCallback(function (wallet) {
    if (wallet instanceof ethers.HDNodeWallet) return wallet;

    if (wallet.mnemonic && wallet.mnemonic.phrase) {
      return ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase);
    }

    throw new Error("No se pudo reconstruir la wallet");
  }, []);

  var refreshWalletData = useCallback(async function () {
    if (!walletData?.wallet || !walletData?.sisCode || isRefreshing) return;

    setIsRefreshing(true);
    try {
      var wallet = reconstructWallet(walletData.wallet);
      var connectedWallet = wallet.connect(provider);

      var [newBalance, nftData, activeRequest] = await Promise.all([
        provider.getBalance(connectedWallet.address),
        fetchNFTData(wallet.address),
        new WalletService(wallet).hasActiveKardexRequest(walletData.sisCode),
      ]);

      setHasActiveRequest(activeRequest);
      var formattedBalance = ethers.formatEther(newBalance);

      setWalletData(function (prev) {
        return {
          ...prev,
          wallet: wallet,
          balance: formattedBalance,
          nftData: nftData,
          lastRefreshed: Date.now(),
        };
      });

      return { balance: formattedBalance };
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [walletData, reconstructWallet, isRefreshing]);

  var logout = useCallback(function () {
    setWalletData(null);
    setHasActiveRequest(false);
    navigate("/");
  }, [navigate]);

  useEffect(function () {
    var isMounted = true;

    var initialize = async function () {
      if (!location.state?.wallet) {
        if (isMounted) navigate("/");
        return;
      }

      try {
        var wallet = reconstructWallet(location.state.wallet);
        var sisCode = location.state.sisCode;
        var isPageReload = performance.getEntriesByType("navigation")[0]?.type === "reload";
        var hasPreloadedData = !isPageReload && location.state.balance !== undefined && location.state.nftData;

        if (hasPreloadedData) {
          setWalletData({
            wallet: wallet,
            balance: location.state.balance,
            sisCode: sisCode,
            nftData: location.state.nftData,
            lastRefreshed: Date.now(),
          });

          new WalletService(wallet).hasActiveKardexRequest(sisCode)
            .then(function (active) { if (isMounted) setHasActiveRequest(active); })
            .catch(function () {});
          return;
        }

        var connectedWallet = wallet.connect(provider);

        var [initialBalance, nftData, activeRequest] = await Promise.all([
          provider.getBalance(connectedWallet.address),
          fetchNFTData(wallet.address),
          new WalletService(wallet).hasActiveKardexRequest(sisCode),
        ]);

        if (!isMounted) return;
        setHasActiveRequest(activeRequest);

        setWalletData({
          wallet: wallet,
          balance: ethers.formatEther(initialBalance),
          sisCode: sisCode,
          nftData: nftData,
          lastRefreshed: Date.now(),
        });
      } catch (err) {
        console.error("Error inicializando wallet:", err);
        if (isMounted) navigate("/");
      }
    };

    initialize();

    return function () { isMounted = false; };
  }, [location.state, navigate, reconstructWallet]);

  return (
    <WalletContext.Provider
      value={{
        walletData: walletData,
        balance: balance,
        refreshWalletData: refreshWalletData,
        isRefreshing: isRefreshing,
        hasActiveRequest: hasActiveRequest,
        setHasActiveRequest: setHasActiveRequest,
        logout: logout,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
