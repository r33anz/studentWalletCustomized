import React, { useState, useCallback } from "react";
import { Card } from "../shared/components/Card";
import { Stepper } from "../shared/components/Stepper";
import { useNavigate } from "react-router-dom";
import LoginService from "./services/LoginService";
import { keccak256, toUtf8Bytes } from "ethers";
import { ethers } from "ethers";
import { getUserFriendlyError } from "../shared/utils/errorHandler";
import { fetchNFTData } from "../shared/services/NFTService";
import { validateSisCode, validateSeedPhrase, normalizeSeedPhrase, validatePassword, validatePasswordMatch } from "../shared/utils/validators";
import { ChevronLeft } from "lucide-react";
import { SisCodeStep } from "./components/SisCodeStep";
import { SeedPhraseStep } from "./components/SeedPhraseStep";
import { PasswordStep } from "./components/PasswordStep";
import { ExistingUserForm } from "./components/ExistingUserForm";

var NEW_USER_STEPS = ["Código SIS", "Frase semilla", "Contraseña"];

export default function Login() {
  var navigate = useNavigate();

  var [isNewUser, setIsNewUser] = useState(true);
  var [step, setStep] = useState(0);
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState("");

  var [sisCode, setSisCode] = useState("");
  var [password, setPassword] = useState("");
  var [seedPhrase, setSeedPhrase] = useState("");
  var [newPassword, setNewPassword] = useState("");
  var [confirmPassword, setConfirmPassword] = useState("");
  var [wallet, setWallet] = useState(null);

  var clearSensitiveData = useCallback(function (fromStep) {
    if (fromStep >= 2) {
      setNewPassword("");
      setConfirmPassword("");
    }
    if (fromStep >= 1) {
      setSeedPhrase("");
      setWallet(null);
    }
  }, []);

  var handleBack = useCallback(function () {
    setError("");
    clearSensitiveData(step);
    setStep(function (s) { return Math.max(0, s - 1); });
  }, [step, clearSensitiveData]);

  var handleTabSwitch = useCallback(function (toNewUser) {
    setIsNewUser(toNewUser);
    setStep(0);
    setError("");
    setPassword("");
    setSeedPhrase("");
    setNewPassword("");
    setConfirmPassword("");
    setWallet(null);
  }, []);

  var normalizedPhrase = normalizeSeedPhrase(seedPhrase);
  var seedWordCount = normalizedPhrase ? normalizedPhrase.split(" ").length : 0;

  var clearError = function () { setError(""); };

  var navigateToWallet = function (walletObj, balanceValue, nftData) {
    var serializableWallet = {
      address: walletObj.address,
      mnemonic: walletObj.mnemonic ? { phrase: walletObj.mnemonic.phrase } : null,
    };

    navigate("/wallet", {
      state: {
        wallet: serializableWallet,
        sisCode: sisCode,
        balance: ethers.formatEther(balanceValue),
        nftData: nftData,
      },
    });
  };

  var handleExistingUserLogin = async function (e) {
    e.preventDefault();

    var sisError = validateSisCode(sisCode);
    if (sisError) { setError(sisError); return; }
    var passError = validatePassword(password);
    if (passError) { setError(passError); return; }

    setIsLoading(true);
    setError("");

    try {
      var encryptedWallet = localStorage.getItem("encryptedWallet");
      if (!encryptedWallet) {
        setError("No se encontró una wallet guardada. Ingresa como nuevo usuario.");
        return;
      }

      var walletT = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
      var walletRecovered = walletT instanceof ethers.HDNodeWallet
        ? walletT
        : ethers.HDNodeWallet.fromPhrase(walletT.mnemonic.phrase);

      var contract = LoginService.connectToManagementContract(walletRecovered);
      if (!contract) {
        setError("No se pudo conectar con el contrato. Intenta de nuevo.");
        return;
      }

      var [passwordRecovered, , balance, nftData] = await Promise.all([
        contract.getStudentPassword(sisCode),
        contract.getStudentAddressBySISCode(sisCode),
        LoginService.getBalance(walletRecovered.address),
        fetchNFTData(walletRecovered.address)
      ]);

      if (passwordRecovered !== keccak256(toUtf8Bytes(password))) {
        setError("Código SIS o contraseña incorrectos");
        return;
      }

      navigateToWallet(walletRecovered, balance, nftData);
    } catch (err) {
      console.error("[Login Error]", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  var handleNewUserStep0 = function (e) {
    e.preventDefault();
    var sisError = validateSisCode(sisCode);
    if (sisError) { setError(sisError); return; }
    setError("");
    setStep(1);
  };

  var handleNewUserStep1 = async function (e) {
    e.preventDefault();
    var seedError = validateSeedPhrase(seedPhrase);
    if (seedError) { setError(seedError); return; }

    setIsLoading(true);
    setError("");

    try {
      var cleanPhrase = normalizeSeedPhrase(seedPhrase);
      var walletGenerated = LoginService.getWalletFromPhrase(cleanPhrase);

      if (!walletGenerated || !(walletGenerated instanceof ethers.HDNodeWallet)) {
        setError("Frase semilla inválida. No se pudo generar la wallet.");
        return;
      }

      setWallet(walletGenerated);
      setStep(2);
    } catch (err) {
      console.error("[Seed Verify Error]", err);
      setError("Frase semilla inválida. Verifica las 12 palabras.");
    } finally {
      setIsLoading(false);
    }
  };

  var handleNewUserStep2 = async function (e) {
    e.preventDefault();
    var passError = validatePassword(newPassword);
    if (passError) { setError(passError); return; }
    var matchError = validatePasswordMatch(newPassword, confirmPassword);
    if (matchError) { setError(matchError); return; }

    setIsLoading(true);
    setError("");

    try {
      var contract = LoginService.connectToManagementContract(wallet);
      if (!contract) {
        setError("No se pudo conectar con el contrato. Intenta de nuevo.");
        return;
      }

      var encryptedWallet = await wallet.encrypt(newPassword);
      localStorage.setItem("encryptedWallet", encryptedWallet);

      var [, balance, nftData] = await Promise.all([
        contract.getStudentAddressBySISCode(sisCode),
        LoginService.getBalance(wallet.address),
        fetchNFTData(wallet.address)
      ]);

      var passwordHash = keccak256(toUtf8Bytes(newPassword));
      await contract.setStudentPassword(sisCode, passwordHash);

      clearSensitiveData(2);
      navigateToWallet(wallet, balance, nftData);
    } catch (err) {
      console.error("[Set Password Error]", err);
      setError(getUserFriendlyError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="w-full max-w-md flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <div className="mx-auto bg-coral w-14 h-14 rounded-2xl flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Billetera Estudiantil</h2>
          </div>

          {(!isNewUser || step === 0) && (
            <div className="flex mb-5 rounded-xl overflow-hidden bg-surface p-1 border border-border">
              <button
                type="button"
                className={"flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all duration-200 " + (isNewUser ? "bg-coral text-white shadow-card" : "text-gray-500 hover:text-gray-700")}
                onClick={function () { handleTabSwitch(true); }}
                disabled={isLoading}
              >
                Nuevo Usuario
              </button>
              <button
                type="button"
                className={"flex-1 py-2 text-center text-sm font-medium rounded-lg transition-all duration-200 " + (!isNewUser ? "bg-coral text-white shadow-card" : "text-gray-500 hover:text-gray-700")}
                onClick={function () { handleTabSwitch(false); }}
                disabled={isLoading}
              >
                Usuario Existente
              </button>
            </div>
          )}

          {isNewUser && step > 0 && (
            <Stepper steps={NEW_USER_STEPS} currentStep={step} />
          )}

          {isNewUser && step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-4 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver
            </button>
          )}

          {!isNewUser && (
            <ExistingUserForm
              sisCode={sisCode}
              password={password}
              onSisCodeChange={function (e) { setSisCode(e.target.value); clearError(); }}
              onPasswordChange={function (e) { setPassword(e.target.value); clearError(); }}
              error={error}
              onSubmit={handleExistingUserLogin}
              isLoading={isLoading}
            />
          )}

          {isNewUser && step === 0 && (
            <SisCodeStep
              sisCode={sisCode}
              onSisCodeChange={function (e) { setSisCode(e.target.value); clearError(); }}
              error={error}
              onSubmit={handleNewUserStep0}
              isLoading={isLoading}
              isNewUser={true}
            />
          )}

          {isNewUser && step === 1 && (
            <SeedPhraseStep
              seedPhrase={seedPhrase}
              onSeedPhraseChange={function (e) { setSeedPhrase(e.target.value); clearError(); }}
              seedWordCount={seedWordCount}
              error={error}
              onSubmit={handleNewUserStep1}
              isLoading={isLoading}
            />
          )}

          {isNewUser && step === 2 && (
            <PasswordStep
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              onNewPasswordChange={function (e) { setNewPassword(e.target.value); clearError(); }}
              onConfirmPasswordChange={function (e) { setConfirmPassword(e.target.value); clearError(); }}
              error={error}
              onSubmit={handleNewUserStep2}
              isLoading={isLoading}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
