import React from "react";
import Nav from "../../../components/header/Nav";
import { useLogout } from "../../../hooks/useAuth";
import LogOutBtn from "../../../components/button/LogOutBtn";
export default function HeaderNav({ children }) {
  const logOut = useLogout();

  const handleSubmit = (e) => {
    e.preventDefault();
    logOut();
  };
  return (
    <Nav>
      {children}
      <LogOutBtn />
    </Nav>
  );
}
