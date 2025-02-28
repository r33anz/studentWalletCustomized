import React from "react";

export const Icon = ({ icon : Icon,onClick,className }) => {
  return (
    <button   
        onClick={onClick}
        className={`p-2 hover:bg-gray-200 rounded ${className}`}
    >
        <Icon className="w-5 h-5 text-gray-600 hover:text-orange-500 transition-colors duration-200" />
    </button>
  );
}