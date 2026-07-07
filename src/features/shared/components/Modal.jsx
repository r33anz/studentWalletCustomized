import React, { useEffect, useRef } from "react";
import { Button } from "./Button";

export var Modal = function ({ children, onClose, showCloseButton }) {
  var overlayRef = useRef(null);
  var contentRef = useRef(null);

  useEffect(function () {
    var previousFocus = document.activeElement;

    var handleKeyDown = function (e) {
      if (e.key === "Escape" && onClose) {
        onClose();
        return;
      }

      if (e.key === "Tab" && contentRef.current) {
        var focusable = contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    if (contentRef.current) {
      var firstFocusable = contentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }

    return function () {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, [onClose]);

  var handleOverlayClick = function (e) {
    if (e.target === overlayRef.current && onClose) onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div ref={contentRef} className="bg-surface-card border border-border rounded-2xl p-6 shadow-elevated max-w-md w-full mx-4">
        <div className="text-center">
          {children}
          {onClose && showCloseButton !== false && (
            <div className="mt-6">
              <Button
                type="button"
                className="w-full bg-coral text-white hover:bg-coral-light"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export var ModalIcon = function ({ type }) {
  if (type === "success") {
    return (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-success-bg">
        <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }
  if (type === "error") {
    return (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-danger-bg">
        <svg className="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-warning-bg">
      <svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
  );
};
