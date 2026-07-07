import React from "react";

export var Icon = function ({ icon: IconComponent, onClick, className, iconClassName, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={"p-2 hover:bg-surface-hover rounded-lg transition-colors duration-200 " + (className || "")}
    >
      <IconComponent className={iconClassName || "w-5 h-5 text-gray-400 hover:text-coral transition-colors duration-200"} />
    </button>
  );
};
