import React from "react";

import { Link } from "react-router-dom";
export default function NavLink({ to, children }) {
  return (
    <Link className="flex justify-start" to={to}>
      <div className="flex gap-1  items-center justify-center">{children}</div>
    </Link>
  );
}
