import React from "react";
import { lazy } from "react";
import { WalletProvider } from "../features/wallet/WalletContext";

const Login = lazy(() => import("../features/auth/Login"));
const Wallet = lazy(() => import("../features/wallet/Wallet"));

export const routes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/wallet",
    element:(
      <WalletProvider>
        <Wallet />
      </WalletProvider>
    ),
  },
];