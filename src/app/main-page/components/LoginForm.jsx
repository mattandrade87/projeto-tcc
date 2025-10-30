"use client";

import { useState } from "react";
import InputField from "./InputField";
import PasswordInput from "./PasswordInput";
import Button from "./Button";
import LinkText from "./LinkText";
import { AuthAPI, AuthStorage } from "@/services/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext.jsx";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext.jsx";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { setRole } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const resp = await AuthAPI.login({
        email: formData.email,
        password: formData.password,
      });

      const token =
        resp?.token ||
        resp?.accessToken ||
        resp?.access_token ||
        resp?.data?.token ||
        resp?.data?.access_token;
      const role =
        resp?.role ||
        resp?.data?.role ||
        resp?.user?.user_metadata?.role ||
        resp?.user?.app_metadata?.role ||
        "USER";
      if (!token) throw new Error("Credenciais inválidas");
      AuthStorage.tokenStore.set(token);
      AuthStorage.roleStore.set(role);
      setRole(role);
      toast.show("Login realizado com sucesso!", "success");
      router.replace(role === "ADMIN" ? "/admin" : "/home");
    } catch (err) {
      toast.show(err?.message || "Falha no login", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <InputField
          label="E-mail"
          name="email"
          placeholder="Digite seu e-mail"
          value={formData.email}
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
        <button
          type="submit"
          disabled={submitting}
          className={`block bg-indigo-500 w-full hover:bg-indigo-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:ring-4 focus:ring-blue-300 outline-none text-center px-6 py-3 ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? <Loader label="Entrando..." /> : "Entrar"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <LinkText href="/recover-password">Esqueceu sua senha?</LinkText>
      </div>
    </form>
  );
}
