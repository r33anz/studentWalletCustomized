import { ethers } from "ethers";
import provider from "../../../contracts/connection/blockchainConnection";
import abiKardexNFT from "../../../contracts/abi/abiKardexNFT";

var FETCH_TIMEOUT = 15000;
var cachedNFTContract = null;

function getNFTContract() {
  if (!cachedNFTContract) {
    var contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT;
    cachedNFTContract = new ethers.Contract(contractAddress, abiKardexNFT, provider);
  }
  return cachedNFTContract;
}

export async function fetchNFTData(walletAddress) {
  try {
    var nftContract = getNFTContract();

    var hasNft = await nftContract.hasKardex(walletAddress);
    if (!hasNft) {
      return { hasNFT: false, message: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex." };
    }

    var tokenId = await nftContract.studentToToken(walletAddress);
    var [kardexInfo, tokenURI] = await Promise.all([
      nftContract.getStudentKardex(walletAddress),
      nftContract.tokenURI(tokenId),
    ]);

    var cid = tokenURI.replace(process.env.REACT_APP_IPFS_GATEWAY, "");
    if (tokenURI.startsWith("ipfs://")) cid = tokenURI.replace("ipfs://", "");

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT);

    var response = await fetch(process.env.REACT_APP_IPFS_GATEWAY + cid, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error("Error fetching metadata");
    var metadata = await response.json();

    return {
      hasNFT: true,
      tokenId: Number(tokenId),
      metadata: metadata,
      kardexInfo: {
        version: Number(kardexInfo.version),
        lastUpdated: Number(kardexInfo.lastUpdated),
        currentIpfsCid: kardexInfo.currentIpfsCid,
      },
      loadedAt: Date.now(),
    };
  } catch (err) {
    console.error("[NFT Fetch Error]", err);
    var msg = (err?.message || err?.reason || "").toLowerCase();

    var isContractError = msg.includes("execution reverted")
      || msg.includes("call_exception")
      || msg.includes("bad result from backend")
      || msg.includes("could not decode result");

    if (isContractError) {
      return { hasNFT: false, message: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex." };
    }

    var isNetwork = msg.includes("failed to fetch")
      || msg.includes("networkerror")
      || msg.includes("network request failed")
      || msg.includes("timeout")
      || msg.includes("aborted")
      || msg.includes("server_error")
      || msg.includes("bad response");

    if (isNetwork) {
      return { hasNFT: false, message: "No se pudo verificar tu NFT en este momento. Intenta refrescar la página." };
    }

    return { hasNFT: false, message: "No se pudieron cargar los datos del NFT. Intenta de nuevo más tarde." };
  }
}
