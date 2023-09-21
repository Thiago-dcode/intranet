import React, { useEffect } from "react";
import ls from "localstorage-slim";
import NavLink from "./NavLink";
import Icon from "../icon/Icon";
import useAjax from "../../../hooks/useAjax";
export default function IntraNav({ modules, company }) {
  const [user, error, isPending, setForm] = useAjax(
    "/api/active-module",
    "POST"
  );
  const setUserModule = (module) => {
    setForm({
      user_id: ls.get("USER", { decrypt: true }),
      module,
    });
  };


  return (
    <aside className="bg-white h-full flex flex-col items-center shadow-md z-50">
      <nav className="overflow-auto flex flex-col gap-2 p-2 ">
        {modules.map((module) => {
          return (
            <NavLink to={`/${company}/${module.route}`}>
              <Icon icon={module.logo} />
              
              <button
                onClick={(e) => {
                  setUserModule(module.name);
                }}
                className="text-black text-center text-sm"
              >
                {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
              </button>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
