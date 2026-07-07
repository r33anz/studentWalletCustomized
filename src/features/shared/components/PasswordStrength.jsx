import React from "react";
import { getPasswordStrength } from "../utils/validators";

export const PasswordStrength = ({ password }) => {
  var strength = getPasswordStrength(password);

  if (!password || password.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(function (i) {
          return (
            <div
              key={i}
              className={"h-1 flex-1 rounded-full transition-all duration-300 " + (i <= strength.level ? strength.color : "bg-border")}
            />
          );
        })}
      </div>
      <p className={"text-xs " + (strength.level <= 1 ? "text-danger" : strength.level <= 2 ? "text-warning" : strength.level <= 3 ? "text-ocean" : "text-success")}>
        {strength.label}
      </p>
    </div>
  );
};
