import {HDNodeWallet,ethers} from 'ethers';
import abiStudentManagement from '../../../contracts/abi/abiStudentManagement';
import provider from '../../../contracts/conecction/blockchainConnection';

class FirstLoginService {

    splitPhrase (text) {
        if(typeof text !== 'string') return ''
        return text.split(/\s+/)
    }

    countWords (arrText){
        if(!Array.isArray(arrText)) return 0
        return arrText.length === 12
    }

    rebuildPhrase(arrText){
        if(!Array.isArray(arrText)) return ''
        return arrText.join(' ')
    }

    getWalletAndPKFromMnemonicPhrase(phrase) {
        const wallet = HDNodeWallet.fromPhrase(phrase);
        return wallet;
    }

    connectToManagementCredentialContractToSetData(wallet) {
        const contractAddressStudentManagement = process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT

        const contractStudentManagementToSetData = new ethers.Contract(
            contractAddressStudentManagement,
            abiStudentManagement,
            wallet.connect(provider)
        );

        return contractStudentManagementToSetData;
    }

    connectToManagementCredentialContractToGetData(){
        const contractAddressStudentManagement = process.env.REACT_APP_CONTRACT_ADDRESS_STUDENT_MANAGEMENT
        const contractStudentManagementToReadData = new ethers.Contract(
            contractAddressStudentManagement,   
            abiStudentManagement,
            provider)
        
        return contractStudentManagementToReadData;
    }

    async getBalance(walletAddress) {
        try {
          const balance = await provider.getBalance(walletAddress);
          return ethers.formatEther(balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
          throw error;
        }
      }

}

export default new FirstLoginService();
