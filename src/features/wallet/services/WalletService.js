import abiStudentManagement from "../../../contracts/abi/abiStudentManagement";
import provider from "../../../contracts/conecction/blockchainConnection";
import { ethers } from "ethers";

class WalletService{
    constructor(walletInstance){
        this.wallet = walletInstance
        
        if (this.wallet) {
            const contractAddressStudentManagement = process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT;
            this.contractStudentManagement = new ethers.Contract(
              contractAddressStudentManagement,
              abiStudentManagement,
              this.wallet.connect(provider)
            );
        }
    }

    async recoverIpfsHashAndBalance(sisCode){
        try {
            if (!this.wallet || !sisCode) {
              console.warn("Wallet not initialized or sisCode missing");
              return ["Sin hash,solicitelo en la seccion de kardex.", "0 TBNB"];
            }

            const [addressAndIPFSHashResult, balanceResult] = await Promise.all([
              this.contractStudentManagement.getAddressAndIPFSHash(sisCode),
              this.getBalance(this.wallet.address)
            ]);
      
            const hash = addressAndIPFSHashResult[1] || "Sin hash,solicitelo en la seccion de kardex.";
            const balance = `${balanceResult} TBNB`;
      
            return [hash, balance];
          } catch (error) {
            console.error("Error in recoverIpfsHashAndBalance:", error);
            return ["Error retrieving hash", "Error retrieving balance"];
          }
    }

    async getBalance(walletAddress) {
        try {
            if (!walletAddress) {
                console.warn("No wallet address provided");
                return "0";
            }
            const balance = await provider.getBalance(walletAddress);
            return ethers.formatEther(balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
            return "0";
        }
    }
}

export default WalletService