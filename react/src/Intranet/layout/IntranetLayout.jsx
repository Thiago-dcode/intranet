import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAjax from "../../hooks/useAjax";
import { useEffect, useState } from "react";
import Page404 from "../../components/error/page404";
import ls from "localstorage-slim";
import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";
import Wrapper from "../../container/Wrapper";

export default function IntranetLayout() {
  const navigate = useNavigate();
  const param = useParams();

  const [dataUser, errorUser, isPendingUser] = useAjax("/api/me");
  const [userModules, errorUserModules, isPendingUserModules] =
    useAjax("/api/modules");
  const [modules, setModules] = useState(null);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    if (!dataUser && errorUser) return;
    if (dataUser === null) return;
    if (param.company !== dataUser?.company_active) {
      navigate("/middle");
      return;
    }

    setAllowed(true);
  }, [dataUser, errorUser]);

  useEffect(() => {
    if (userModules && !errorUserModules) {
      setModules(userModules.data.modules);
    }
  }, [userModules]);
  return (
    <>
      {allowed && modules ? (
        <>
          <Nav company={dataUser?.company_active} modules={modules} />{" "}
          <Wrapper>
            <Outlet />{" "}
          </Wrapper>
        </>
      ) : null}
    </>
  );
}
