import { useEffect, useState } from "react";
import ls from "localstorage-slim";
import Api from "../api/Api";
import { useNavigate } from "react-router-dom";

export default function useAjax(
  url = "",
  method = "GET",
  formData = {},
  config = {},
  headers = {},
  csrf = false
) {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [error, setError] = useState(null);

  const [isPending, setIsPending] = useState(false);
  const [_url, setUrl] = useState(url);
  const [form, setForm] = useState(formData);

  const ajax = async (signal) => {
    setError("");
    setIsPending(true);
    try {
      if (_url === "/api/login") {
        const response = await Api.get("/sanctum/csrf-cookie");
        console.log(response);
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
      setError(error.response?.data.message);
      console.log(error);
      switch (error.response?.data?.status) {
        case 401:
          ls.clear();
          break;

        default:
          break;
      }
    } finally {
      setIsPending(false);
    }
  };

  const fetch = () => {};
  useEffect(() => {
    if (!_url || !url) return;

    if (
      method === "POST" &&
      !(Object.keys(form).length || Object.keys(formData).length)
    )
      return;
    const controller = new AbortController();
    const signal = controller.signal;
    ajax(signal);
  }, [_url, form]);

  useEffect(() => {
    if (!data && error) {
      if (error.status === 401) {
        console.log(error);
        // navigate("/login");
      }
    }
  }, [data, error]);

  return [data, error, isPending, setForm];
}
