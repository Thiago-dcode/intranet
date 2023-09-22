import React from "react";

import { Link } from "react-router-dom";
export default function NavLink({ to, children }) {
  return (
    <Link className=" flex items-center gap-2 " to={to}>
      {children}
    </Link>
  );
}
