import React from "react";
import { AppRouter } from "./routes/AppRouter";
import { ToastProvider } from "./features/shared/components/Toast";
import { ErrorBoundary } from "./features/shared/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </ErrorBoundary>
  );
}
