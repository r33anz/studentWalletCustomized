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
    
    async hasActiveKardexRequest(sisCode) {
        try {
            if (!sisCode) {
                console.warn("No SIS code provided");
                return false;
            }
            const hasRequest = await this.contractStudentManagement.hasActiveKardexRequest(sisCode);
            return hasRequest;
        } catch (error) {
            console.error("Error checking kardex request status:", error);
            return false;
        }
    }
}

export default WalletService