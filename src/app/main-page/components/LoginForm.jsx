"use client";

import { useState } from "react";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import Button from "./Button";
import LinkText from "./LinkText";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    // Aqui futuramente será feita a chamada para a API
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Esqueceu a senha clicado");
    // Aqui futuramente será implementada a lógica de recuperação de senha
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <InputField
          label="ID"
          name="id"
          placeholder="Digite seu ID"
          value={formData.id}
          onChange={handleInputChange}
        />

        <PasswordInput
          label="Senha"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>

      <div className="mt-6 w-full">
        <Button type="submit" className="w-full" href="home">Entrar</Button>
      </div>

      <div className="mt-4 text-center">
        <LinkText onClick={handleForgotPassword}>Esqueceu sua senha?</LinkText>
      </div>
    </form>
  );
}
