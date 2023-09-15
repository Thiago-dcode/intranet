import useAjax from "./useAjax";
import { useNavigate } from "react-router-dom";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";

export function useIsAuth() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState();
  const [data, error, IsPending] = useAjax("/api/me");
  const handleIsAuth = () => {
    const token = ls.get("ACCESS_TOKEN");

    if (!token || (!data && error)) return false;
    return true;
  };

  useEffect(() => {
    setIsAuth(handleIsAuth());
  }, []);

  useEffect(() => {
    if (isAuth) navigate("/");
    else navigate("");
  }, [isAuth]);

  return isAuth;
}

export function useLogin() {
  const [data, error, isPending, setForm] = useAjax("/api/login", "POST");
  const navigate = useNavigate();
  const login = (form) => {
    console.log(form)
    setForm(form);
  };

  useEffect(() => {
    if (data && !error) {
      console.log(data.data.token);
      console.log(data);
      ls.config.ttl = 60 * 60 * 3;
      ls.set("USER", data.data.user.id);
      ls.set("ACCESS_TOKEN", data.data.token);
      navigate("/middle");
    }
  }, [data, error]);

  return [data, error, isPending, login];
}

export function useLogout() {
  const [data, error, isPending, setForm] = useAjax("/api/logout", "POST");
  const navigate = useNavigate();
  const logout = (e) => {
    setForm({
      logout: true,
    });
  };

  useEffect(() => {
    if (data && !error) {
      ls.remove("USER");
      ls.remove("ACCESS_TOKEN");
      navigate("/login");
    }
  }, [data, error]);

  return logout;
}
