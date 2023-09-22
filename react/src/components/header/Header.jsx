import React from "react";

export default function Header({ children }) {
  return (
    <header className=" sticky top-0 flex items-center w-full justify-center border-b border-b-slate-400 bg-white p-2">
      {children}
    </header>
  );
}
 