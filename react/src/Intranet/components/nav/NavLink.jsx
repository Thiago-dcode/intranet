import React from "react";

import { Link } from "react-router-dom";
export default function NavLink({ to, children }) {
  return (
    <Link className="flex items-center w-full justify-center" to={to}>
      <div className=" flex items-center gap-2  w-full" >
      {children}
      </div>
      
    </Link>
  );
}
