import { ethers } from "ethers";

// Configuración para Chainlink (usando BSC Testnet)
const CHAINLINK_PRICE_FEEDS = {
  ETH_USD: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7" // ETH/USD en BSC Testnet
};

const AGGREGATOR_ABI = [
  "function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80)"
];

export class PriceOracleService {
  constructor(provider) {
    this.provider = provider;
  }

  async getEthPriceInUSD() {
    try {
      const contract = new ethers.Contract(
        CHAINLINK_PRICE_FEEDS.ETH_USD,
        AGGREGATOR_ABI,
        this.provider
      );
      
      const roundData = await contract.latestRoundData();
      const price = roundData[1]; // El precio está en 8 decimales
      return Number(ethers.formatUnits(price, 8)); // Convertimos a decimal normal
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      throw error;
    }
  }

  async calculateRequiredEth(txCostInUSD) {
    const ethPrice = await this.getEthPriceInUSD();
    return txCostInUSD / ethPrice; // Retorna la cantidad de ETH necesarios
  }
}