import { useEffect, useState } from "react";
import Api from "../api/Api";
export default function useAjax(
  url = "",
  method = "GET",
  formData = {},
  config = {},
  headers = {},
  csrf = false
) {
  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const [isPending, setIsPending] = useState(false);
  const [_url, setUrl] = useState(url);
  const [form, setForm] = useState(formData);

  const ajax = async (signal) => {
    setError("");
    setIsPending(true);
    try {
      if (csrf) {
        await Api.get("/sanctum/csrf-cookie");
      }
      const { data } = await Api({
        method,
        url: _url,
        data: form,
        headers: { ...headers },
        params: { signal, ...config },
      });
      setData(data);
    } catch (error) {
      setError(error.response?.data?.message);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (!_url || !url) return;
    if (method === "POST" && !Object.keys(form).length) return;
    const controller = new AbortController();
    const signal = controller.signal;
    ajax(signal);

    return () => controller.abort();
  }, [_url, form]);

  useEffect(() => {
    if (_url !== "api/login" || _url !== "api/logout") {
      return;
    }
    if (data && !error) {
      if (_url === "api/logout") {
        ls.remove("USER");
        ls.remove("ACCESS_TOKEN");
        navigate("/login");
        return;
      }
      if (_url === "api/login") {
        console.log(data.data.token);
        ls.set("USER", data.data.user.id);
        ls.set("ACCESS_TOKEN", data.data.token);
        navigate("/middle");
      }
    }
  }, [data, error]);

  return [data, error, isPending, setForm];
}
