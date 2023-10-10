import { Link, useNavigate, useParams } from "react-router-dom";
import useAjax from "../../hooks/useAjax";
import { useEffect, useState } from "react";
import WrapperIntranet from "../container/WrapperIntranet";
import { Outlet } from "react-router-dom";
import Nav from "../components/nav/AsideWrapper";
import HeaderNav from "../components/nav/HeaderNav";
import Header from "../../components/header/Header";
import '../assets/css/main.css'
import '../assets/css/nav.css'
import useCheckDevice from "../../hooks/useCheckDevice";
export default function IntranetLayout() {
  const navigate = useNavigate();
  const param = useParams();
  const device = useCheckDevice()
  const [dataUser, errorUser, isPendingUser] = useAjax("/api/me");
  const [userModules, errorUserModules, isPendingUserModules, setConfigUserModules] =
    useAjax();
  const [modules, setModules] = useState(null);
  const [allowed, setAllowed] = useState(false);
  const [company, setCompany] = useState(null);
  useEffect(() => {
    if (!dataUser && errorUser) return;
    if (dataUser === null) return;
    if (param.company !== dataUser?.company_active) {
      navigate("/bienvenido");
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
  useEffect(() => {
    if(!allowed) return
    setConfigUserModules('/api/modules')

  }, [allowed]);
  return (
    <>
      {allowed && modules ? (
        <>
          <WrapperIntranet>
            <Header>
              <HeaderNav>
                {company && (
                  <Link style={{
                    position: 'relative',
                    left: device.isPhone || device.isTablet ? '27px' : 0,


                  }} to={"/" + company.name}>
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
              <main id="intranet-main" className="xl:w-[calc(100%-10rem)] lg:w-[calc(100%-8.5rem)] w-full mt-10 lg:mt-0 xl:mt-0 relative xl:ml-40  lg:ml-40 flex flex-col items-center h-full">
                <Outlet />
              </main>
            </div>
          </WrapperIntranet>
        </>
      ) : null}
    </>
  );
}
