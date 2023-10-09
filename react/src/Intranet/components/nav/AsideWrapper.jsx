import React, { useEffect } from "react";
import useCheckDevice from "../../../hooks/useCheckDevice";
import ls from "localstorage-slim";
import Icon from "../icon/Icon";
import useAjax from "../../../hooks/useAjax";

import { AsideNav } from "./partials/AsideNav";
import AsideNavPhone from "./partials/AsideNavPhone";
export default function IntraNav({ modules, company }) {
  const [user, error, isPending, setConfig] = useAjax(
    "/api/active-module",
    "POST"
  );

  const device = useCheckDevice();

  const setUserModule = (module) => {
    setConfig({
      user_id: ls.get("USER", { decrypt: true }),
      module,
    });
  };


  return (
    <>

      {company && modules &&
        <>
          {device.isDesktop && <AsideNav setModule={setUserModule} company={company} modules={modules} />}
          {(device.isPhone || device.isTablet) && <AsideNavPhone setModule={setUserModule} company={company} modules={modules} />}
        </>
      }


    </>
  );
}
