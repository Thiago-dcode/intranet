import { useEffect, useState } from "react";
import useAjax from "../../hooks/useAjax";
import logo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Wrapper from "../../container/Wrapper";
import Header from "../../components/header/Header";
import Nav from "../../components/header/Nav";
import LogOutBtn from "../../components/button/LogOutBtn";
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
    if (userCompanyActive === null) return;

    if (userCompanyActive && !errorUserCompanyActive) {
      // if (!userCompanyActive.data.user?.company_active) return;
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
      <Header>
        <Nav>
          <Link className="text-3xl font-bold leading-none" to={"/"}>
            <img className="h-10" src={logo}></img>
          </Link>
          <LogOutBtn />
        </Nav>
      </Header>

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
