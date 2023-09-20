import React from "react";

export default function WrapperIntranet({ children }) {
  return (
    <div
      className="flex h-screen border-2 flex-col items-center 
    "
    >
      {children}
    </div>
  );
}
