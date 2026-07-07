import { ethers } from "ethers";

var rpcUrl = process.env.REACT_APP_RPC_URL || "https://data-seed-prebsc-1-s1.binance.org:8545/";
var fallbackUrl = process.env.REACT_APP_RPC_FALLBACK_URL || "https://data-seed-prebsc-2-s1.binance.org:8545/";

var mainProvider = new ethers.JsonRpcProvider(rpcUrl);
var fallbackProvider = new ethers.JsonRpcProvider(fallbackUrl);

var provider = new ethers.FallbackProvider([
  { provider: mainProvider, priority: 1, stallTimeout: 2000 },
  { provider: fallbackProvider, priority: 2, stallTimeout: 2000 },
]);

export default provider;
