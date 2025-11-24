"use client";
import { useState } from "react";
import { AuthAPI } from "@/services/api";
import { useToast } from "@/context/ToastContext.jsx";
import Loader from "@/components/ui/Loader";
import { Title } from "@/app/main-page/components";
import { BackButton } from "@/components/ui";

export default function RecoverPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthAPI.recoverPassword({ email });
      toast.show("Email de recuperação enviado", "success");
    } catch (e) {
      toast.show(e?.message || "Erro ao enviar email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-6 text-center space-y-2">
          <BackButton />
          <Title>Recuperar senha</Title>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg w-full ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? <Loader label="Enviando..." /> : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
