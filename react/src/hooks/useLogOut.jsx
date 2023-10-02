import useAjax from "./useAjax";
import { useNavigate } from "react-router-dom";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";

export default function useLogout() {
  const [data, error, isPending, setConfig] = useAjax("/api/logout", "POST");

  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    setConfig("/api/logout", {
      logout: true,
    }, "POST");
  };

  useEffect(() => {
    if (data || error) {
      ls.remove("USER");
      ls.remove("ACCESS_TOKEN");
      navigate("/login");
    }
  }, [data, error]);

  return logout;
}
