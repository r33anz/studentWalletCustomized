import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-surface-card border border-border rounded-2xl p-6 shadow-card ${className}`}>
      {children}
    </div>
  );
}
