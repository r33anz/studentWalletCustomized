import {Wallet,ethers} from 'ethers';
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
        const wallet = Wallet.fromPhrase(phrase);
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
        /*console.log(abiStudentManagement)
        console.log(provider)
        console.log(contractAddressStudentManagement)*/
        const contractStudentManagementToReadData = new ethers.Contract(
            contractAddressStudentManagement,   
            abiStudentManagement,
            provider)
        //console.log(contractStudentManagementToReadData)
        
        return contractStudentManagementToReadData;
    }


}

export default new FirstLoginService();
