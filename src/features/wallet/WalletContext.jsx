import React,{useState,useContext,useEffect} from "react";
import { useLocation,useNavigate } from "react-router-dom"; 

const WalletContext = React.createContext();
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({children}) => { 
    const [walletData, setWalletData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Si venimos de la página de login, obtenemos los datos
        console.log("State",location.state)
        if (location.state && location.state.address) {
            
            setWalletData(location.state)
        } else {
          // Si no hay datos, redirigimos al login
          // Puedes comentar esto si quieres permitir acceso sin datos
         
          navigate("/")
        }
      }, [location, navigate])

    return (
        <WalletContext.Provider value={{
            walletData, 
            setWalletData
        }}>
            {children}
        </WalletContext.Provider>
    );
}