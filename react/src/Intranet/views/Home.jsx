import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAjax from "../../hooks/useAjax";
useParams;
export default function Home() {
  const [company, error, isPending] = useAjax("/api/company");
  useEffect(() => {
    console.log(company);
  }, [company, error]);
  return <>{company && <div>{"Bienvenido a " + company.name}</div>}</>;
}
