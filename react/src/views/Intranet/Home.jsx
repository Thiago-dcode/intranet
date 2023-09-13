import { useParams } from "react-router-dom";
import useAjax from "../../hooks/useAjax";
import { useEffect, useState } from "react";
import Page404 from "../../components/error/Page404";
export default function Home() {
  const param = useParams();
  const [data, error, isPending] = useAjax("/api/company", "POST", param);
  const [company, setCompany] = useState(null);
  useEffect(() => {
    console.log(param, error);

    if (data && !error) {
      setCompany(data.data.company);
      return;
    }
    
  }, [data, error]);
  return (
    <>
      {!isPending && !error && company ? (
        <div className="bg-arzumaBlack text-cyan-500 h-screen">
          <p>Hola, {company.name} bienvenido a la Intranet</p>
        </div>
      ) : null}
      {error?.status=== 404? <Page404/>:null}
    </>
  );
}
