import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAjax from "../../hooks/useAjax";
import { useEffect, useState } from "react";
import WrapperIntranet from "../container/WrapperIntranet";
import { Outlet } from "react-router-dom";
import Nav from "../components/nav/AsideNav";
import HeaderNav from "../components/nav/HeaderNav";
import Header from "../../components/header/Header";

export default function IntranetLayout() {
  const navigate = useNavigate();
  const param = useParams();

  const [dataUser, errorUser, isPendingUser] = useAjax("/api/me");
  const [userModules, errorUserModules, isPendingUserModules] =
    useAjax("/api/modules");
  const [modules, setModules] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [company, setCompany] = useState(null);
  useEffect(() => {
    if (!dataUser && errorUser) return;
    if (dataUser === null) return;
    if (param.company !== dataUser?.company_active) {
      navigate("/middle");
      return;
    }
    for (let i = 0; i < dataUser.companies.length; i++) {
      if (dataUser.companies[i].name !== dataUser?.company_active) continue;
      setCompany(dataUser.companies[i]);
      break;
    }
    setAllowed(true);
  }, [dataUser, errorUser]);

  useEffect(() => {
    if (userModules && !errorUserModules) {
      setModules(userModules.data.modules);
    }
  }, [userModules]);
  useEffect(() => {}, [company]);
  return (
    <>
      {allowed && modules ? (
        <>
          <WrapperIntranet>
            <Header>
              <HeaderNav>
                {company && (
                  <Link to={"/" + company.name}>
                    {" "}
                    <img
                      width={"60px"}
                      src={company.logo}
                      alt={`Logo ${company.name}`}
                    />
                  </Link>
                )}
              </HeaderNav>
            </Header>
            <div className=" h-full flex items-center justify-between w-full">
              <Nav company={dataUser?.company_active} modules={modules} />
              <main className="w-full   relative ml-40 flex flex-col items-center h-full">
                <Outlet />
              </main>
            </div>
          </WrapperIntranet>
        </>
      ) : null}
    </>
  );
}
