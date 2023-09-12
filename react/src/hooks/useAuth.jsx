import useAjax from "./useAjax";
import { useNavigate } from "react-router-dom";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";

export function useIsAuth() {
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

export function useLogin() {
  const [data, error, isPending, setForm] = useAjax("/api/login", "POST");
  const navigate = useNavigate();
  const login = (form) => {
    setForm(form);
  };

  useEffect(() => {
    if (data && !error) {
      console.log(data.data.token);
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
