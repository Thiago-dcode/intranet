import { useEffect, useState } from "react";
import ls from "localstorage-slim";
import { Link, Outlet, Navigate, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import Wrapper from "../../container/Wrapper";

import { useIsAuth } from "../../hooks/useAuth";
export default function GuestLayout() {
  const navigate = useNavigate();
  const [token, setToken] = useState(ls.get("ACCESS_TOKEN"));
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/middle");
      return;
    }
    setIsGuest(true)
  }, []);

  return (
    <>
      {isGuest ? (
        <>
          <header className=" sticky top-0 flex items-center w-full justify-center  shadow-md bg-white">
            <nav className=" w-full max-w-4xl px-4 py-4 flex justify-between items-center">
              <Link className="text-3xl font-bold leading-none" to={"/"}>
                <img className="h-10" src={logo}></img>
              </Link>

              <Link
                className=" lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-arzumaOrange hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
                to="/login"
              >
                Entrar
              </Link>
            </nav>
          </header>

          <Wrapper>
            <Outlet />
          </Wrapper>
        </>
      ) : null}
    </>
  );
}
