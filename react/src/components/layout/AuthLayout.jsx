import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import Wrapper from "../../container/Wrapper";
import { useIsAuth, useLogout } from "../../hooks/useAuth";

export default function AuthLayout() {
  const navigate = useNavigate();
  const isAuth = useIsAuth();
  const logOut = useLogout();
  const handleSubmit = (e) => {
    e.preventDefault();
    logOut();
  };
  return (
    <>
      {isAuth && (
        <>
          <header className=" sticky top-0 flex items-center w-full justify-center  shadow-md bg-white">
            <nav className=" w-full max-w-4xl px-4 py-4 flex justify-between items-center">
              <Link className="text-3xl font-bold leading-none" to={"/"}>
                <img className="h-10" src={logo}></img>
              </Link>

              <form
                className=" lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-arzumaOrange hover:bg-gray-100 text-sm text-gray-900 font-bold  rounded-xl transition duration-200"
                to="/login"
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <button type="submit">Salir</button>
              </form>
            </nav>
          </header>
          <Wrapper>
            <Outlet />
          </Wrapper>
        </>
      )}
    </>
  );
}
