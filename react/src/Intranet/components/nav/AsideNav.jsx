import React from "react";

import { useLogout } from "../../../hooks/useAuth";
import NavLink from "./NavLink";
import Icon from "../icon/Icon";
export default function IntraNav({ modules, company }) {
  const logOut = useLogout();

  const showHideNav = (e) => {};

  return (
    <aside className="bg-white h-full flex flex-col items-center shadow-md z-50">
   
        <nav className="overflow-auto flex flex-col gap-2 p-2 ">
          {modules.map((module) => {
            return (
              <NavLink to={`/${company}/${module.route}`}>
                <Icon icon={module.logo} />
                <p className="text-black text-center ">
                  {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
                </p>
              </NavLink>
            );
          })}
         
        </nav>
     
    </aside>
  );
}
