import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      {children}
    </div>
  );
}