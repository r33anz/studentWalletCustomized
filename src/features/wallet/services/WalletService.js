import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import provider from "../../../contracts/connection/blockchainConnection";
import { ethers } from "ethers";

var TX_FEE_ETH = process.env.REACT_APP_TX_FEE_ETH || "0.001";
var contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT;
var cachedContract = null;
var cachedWalletAddress = null;

class WalletService {
  constructor(walletInstance) {
    this.wallet = walletInstance;

    if (this.wallet) {
      if (cachedContract && cachedWalletAddress === this.wallet.address) {
        this.contract = cachedContract;
      } else {
        this.contract = new ethers.Contract(
          contractAddress,
          abiStudentManagement,
          this.wallet.connect(provider)
        );
        cachedContract = this.contract;
        cachedWalletAddress = this.wallet.address;
      }
    }
  }

  async hasActiveKardexRequest(sisCode) {
    try {
      if (!sisCode) return false;
      return await this.contract.hasActiveKardexRequest(sisCode);
    } catch (error) {
      console.error("Error checking kardex request status:", error);
      return false;
    }
  }

  async requestKardex(sisCode) {
    if (!this.wallet || !(this.wallet instanceof ethers.HDNodeWallet)) {
      throw new Error("Wallet no válida. Cierra sesión e ingresa de nuevo.");
    }

    var requiredWei = ethers.parseEther(TX_FEE_ETH);
    var currentBalance = await provider.getBalance(this.wallet.address);

    if (currentBalance < requiredWei) {
      throw new Error("Saldo insuficiente. Necesitas al menos " + TX_FEE_ETH + " ETH.");
    }

    var tx = await this.contract.requestKardex(sisCode, { value: requiredWei });
    await tx.wait();
  }
}

export default WalletService;
