import React from "react";
import { Link } from "react-router-dom";
import Nav from "../../../components/header/Nav";
import Header from "../../../components/header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";
import { useLogout } from "../../../hooks/useAuth";
export default function IntraNav({ modules, company }) {
const logOut = useLogout()
  const handleSubmit = (e) => {
    e.preventDefault();
    logOut();
  };
  return (
    <Header>
      <Nav>
        {modules.map((module) => {
          return (
            <Link to={`/${company}${module.route}`}>
              <FontAwesomeIcon icon={Icons["fa" + module.logo]} />
              <p className="text-black">{module.name}</p>
            </Link>
          );
        })}
        <form
          className="lg:mr-3 py-2 px-6 bg-arzumaOrange hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
          to="/login"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <button type="submit">Salir</button>
        </form>
      </Nav>
    </Header>
  );
}
