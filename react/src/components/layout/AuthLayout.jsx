import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ls from "localstorage-slim";
import logo from "../../assets/img/logo.png";
import Wrapper from "../../container/Wrapper";
import { useLogout } from "../../hooks/useAuth";

export default function AuthLayout() {
  const navigate = useNavigate();

  const [token, setToken] = useState(ls.get("ACCESS_TOKEN"));
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    setisAuth(true);
  }, []);

  return (
    <>
      {isAuth ? (
        <>
          <Outlet />
        </>
      ) : null}
    </>
  );
}
