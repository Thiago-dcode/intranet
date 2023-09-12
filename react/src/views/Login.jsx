import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import useAjax from "../hooks/useAjax";
import ls from "localstorage-slim";
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [session, error, isPending, setForm] = useAjax(
    "/api/login",
    "POST",
    {},
    {},
    {},
    true
  );

  const handleSubmit = (e) => {
    console.log("submit");
    e.preventDefault();
    if (!email || !password) return;

    setForm({
      email,
      password,
    });
  };
  const redirect = () => {
    if (session && !error && !isPending) {
      console.log(session.data.token);
      ls.set("USER", session.data.user.id);
      ls.set("ACCESS_TOKEN", session.data.token);
      navigate("/middle");
    }
  };
  useEffect(() => {
    redirect();
  }, [session, error, isPending]);

  return (
    <Form
      title="Iniciar sesión"
      handleSubmit={handleSubmit}
      elements={[
        <Input type="text" handleInput={setEmail} value={email} name="Email" />,
        <Input
          type="password"
          handleInput={setPassword}
          value={password}
          name="Contraseña"
        />,
      ]}
      error={error}
      isPending={isPending}
      buttonText="Iniciar sesión"
    />
  );
}
