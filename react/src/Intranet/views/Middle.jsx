import { useEffect, useState } from "react";
import useAjax from "../../hooks/useAjax";
import logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "../../container/Wrapper";
export default function Middle() {
  const navigate = useNavigate();
  const [user, error, isPending] = useAjax("/api/me");
  const [
    userCompanyActive,
    errorUserCompanyActive,
    isPendingUserCompanyActive,
    setForm,
  ] = useAjax("/api/active-company", "POST");
  const [companyActive, setCompanyActive] = useState(null);
  const [company, setCompany] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(user);
    if (userCompanyActive === null) return;

    if (userCompanyActive && !errorUserCompanyActive) {
      if (!userCompanyActive.data.user?.company_active) return;
      setCompanyActive(userCompanyActive.data.user.company_active);
      return;
    }
  }, [userCompanyActive, errorUserCompanyActive]);

  useEffect(() => {
    if (!company) return;

    setForm({
      user_id: user.id,
      company,
    });
  }, [company]);

  useEffect(() => {
    if (!companyActive) return;

    navigate("/" + companyActive);
  }, [companyActive]);

  return (
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
      {!isPending && user ? (
        <div className="justify-self-center self-center">
          <h1>Hola {user.name}</h1>
          <form
            onSubmit={(e) => {
              handleSubmit(e);
            }}
            className="flex gap-3"
          >
            {user.companies.map((company) => {
              return (
                <button
                  type="submit"
                  style={{ background: company.color }}
                  className="p-1 text-white rounded-md"
                  name="company"
                  value={company.name}
                  onClick={(e) => {
                    setCompany(company.name);
                  }}
                >
                  {company.name}
                </button>
              );
            })}
          </form>
        </div>
      ) : null}
    </Wrapper>
    </>
  );
}
