import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function Nav({ modules }) {
  return (
    <nav className=" w-full max-w-4xl px-4 py-4 flex justify-between items-center">
      {modules.map((module) => {
        <Link to={module.route}>
          <FontAwesomeIcon
            className="icon post"
            icon={solid(module.logo)}
            style={{ color: "#ffffff" }}
          />
          <p>{module.name}</p>
        </Link>;
      })}
    </nav>
  );
}
