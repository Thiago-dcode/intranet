import React, { useState, useContext } from "react";
import Api from "../api/Api";
import Form from "../components/form/Form";
import Input from "../components/form/Input";
import { userStateContext } from "../Context/ContextProvider";

export default function Login() {
  const state = userStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const login = async (formData, signal) => {
    setIsPending(true);
    try {
      const { data } = await Api.post("/login", formData, { signal });

  
      state.setCurrentUser(data.data.user);
      state.setUserToken(data.data.token);

      setError("");
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data.message);
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    const controller = new AbortController();
    const signal = controller.signal;

    login({ email, password }, signal);

    return () => controller.abort();
  };

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
