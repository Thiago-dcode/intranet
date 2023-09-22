import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Api from "../api/Api";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import useAjax from "../hooks/useAjax";
import ls from "localstorage-slim";
import useLogin from "../hooks/useLogIn";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, error, isPending, login] = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();

    login({
      email,
      password,
    });
  };

  return (
    <div className="mt-14">

  
    <Form
      title="Iniciar sesión"
      handleSubmit={handleSubmit}
      elements={[
        <Input
          id={"email-input-login"}
          type="text"
          handleInput={setEmail}
          value={email}
          name="Email"
        />,
        <Input
          id={"password-input-login"}
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
      </div>
  );
}
