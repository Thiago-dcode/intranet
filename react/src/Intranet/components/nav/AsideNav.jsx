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
    <aside className="  text-xs text-nav fixed  h-screen flex flex-col px-5 items-center justify-between  border-r border-r-slate-400 bg-white ">
      <nav className="overflow-auto mt-16 w-full h-full flex flex-col gap-3 px-5">
        {modules.map((module) => {
          return (
            <NavLink to={`/${company}/${module.route}`}>
              <Icon icon={module.logo} />

              <button
                onClick={(e) => {
                  setUserModule(module.name);
                }}
                className=" text-center"
              >
                {module.name.charAt(0).toUpperCase() + module.name.slice(1)}
              </button>
            </NavLink>
          );
        })}
      </nav>
      <div className="  border-t border-t-slate-400 w-full flex items-center justify-center">
        <button className="">expand</button>
      </div>
    </aside>
  );
}
