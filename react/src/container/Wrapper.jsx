import React, { ReactNode } from "react";

const Wrapper = ({ children }) => {
  return (
    <main className="pt-10 overscroll-auto overflow-hidden flex flex-col justify-between items-center h-screen bg-gray-100">
      {children}
    </main>
  );
};

export default Wrapper;
