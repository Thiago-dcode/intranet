import React from "react";

export default function Header({ children }) {
  return (
    <header className=" sticky top-0 flex items-center w-full justify-center  shadow-md bg-white p-2">
      {children}
    </header>
  );
}
