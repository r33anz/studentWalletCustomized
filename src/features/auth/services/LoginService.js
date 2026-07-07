import { HDNodeWallet, ethers } from "ethers";
import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import provider from "../../../contracts/connection/blockchainConnection";

var contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT;

class AuthService {
  constructor() {
    this._contractCache = null;
    this._cachedAddress = null;
  }

  getWalletFromPhrase(phrase) {
    return HDNodeWallet.fromPhrase(phrase);
  }

  connectToManagementContract(wallet) {
    if (this._contractCache && this._cachedAddress === wallet.address) {
      return this._contractCache;
    }

    this._contractCache = new ethers.Contract(
      contractAddress,
      abiStudentManagement,
      wallet.connect(provider)
    );
    this._cachedAddress = wallet.address;
    return this._contractCache;
  }

  async getBalance(walletAddress) {
    return provider.getBalance(walletAddress);
  }
}

export default new AuthService();
