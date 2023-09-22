import useAjax from "./useAjax";
import { useNavigate } from "react-router-dom";
import ls from "localstorage-slim";
import { useEffect, useState } from "react";

export default function useLogin() {
  const [data, error, isPending, setForm] = useAjax("/api/login", "POST");
  const navigate = useNavigate();
  const login = (form) => {
    setForm(form);
  };

  useEffect(() => {
    if (data && !error) {
      ls.config.ttl = 60 * 60 * 3;
      ls.config.encrypt = true;
      ls.set("USER", data.data.user.id);
      ls.set("ACCESS_TOKEN", data.data.token);
      navigate("/middle");
    }
    if (error) {
      console.log(error);
    }
  }, [data, error]);

  return [data, error, isPending, login];
}