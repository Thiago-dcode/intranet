import useAjax from "./useAjax";
import { useNavigate } from "react-router-dom";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";

export default function useIsAuth() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(true);
  const token = ls.get("ACCESS_TOKEN");
  const [data, error, isPending] = useAjax("/api/me", "GET");

  useEffect(() => {
    if (!token) {
      setIsAuth(false);
      navigate("/");
      return;
    }
    if (token && !data && error && !isPending) {
      setIsAuth(false);
      navigate("/");
      return;
    }
    console.log(token);
    navigate("/middle");
    setIsAuth(true);
  }, []);

  return isAuth;
}
