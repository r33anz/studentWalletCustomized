import React,{ Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { WalletProvider } from "../features/wallet/WalletContext";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <WalletProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </WalletProvider>
    </BrowserRouter>
  );
};