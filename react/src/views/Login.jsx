import React, { useState, useContext, useEffect } from "react";
import { redirect } from "react-router-dom";
import Api from "../api/Api";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import useAjax from "../hooks/useAjax";

export default function Login() {
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
  useEffect(() => {
    console.log(session);
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
