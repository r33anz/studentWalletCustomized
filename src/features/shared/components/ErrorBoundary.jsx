import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReload = function () {
    window.location.reload();
  };

  handleGoHome = function () {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="bg-surface-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-card">
            <div className="mx-auto bg-danger-bg w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Algo salió mal</h2>
            <p className="text-sm text-gray-500 mb-6">
              Ocurrió un error inesperado. Intenta recargar la página o volver al inicio.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-5 py-3 rounded-xl font-semibold text-gray-600 bg-surface-muted hover:bg-surface-hover border border-border transition-all duration-200 text-sm"
              >
                Ir al inicio
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-3 rounded-xl font-semibold text-white bg-coral hover:bg-coral-light transition-all duration-200 text-sm"
              >
                Recargar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
