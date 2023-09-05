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
    console.log("hello");
    const controller = new AbortController();
    const signal = controller.signal;
    ajax(signal);

    return () => controller.abort();
  }, [_url, form]);

  //   useEffect(() => {

  //     if (!url) return;
  //     console.log(url, method);
  //     const controller = new AbortController();
  //     const signal = controller.signal;
  //     ajax(signal);
  //     return () => controller.abort();
  //   }, [method, url, formData, headers, config]);

  //   useEffect(() => {
  //     console.log(form);
  //     const controller = new AbortController();
  //     const signal = controller.signal;
  //     ajax(signal);
  //     return () => controller.abort();
  //   }, []);

  return [data, error, isPending, setForm];
}
