"use client";
import { useState } from "react";
import { AuthAPI } from "@/services/api";
import { useToast } from "@/context/ToastContext.jsx";
import Loader from "@/app/ui/Loader.jsx";
import { Title } from "@/app/main-page/components";

export default function SupabaseSignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthAPI.supabaseSignup({ email, password });
      toast.show("Registrado no Supabase", "success");
      setEmail("");
      setPassword("");
    } catch (e) {
      toast.show(e?.message || "Erro no cadastro", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-4 text-center">
          <Title>Supabase Signup</Title>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </Field>
          <button
            disabled={loading}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg w-full ${
              loading ? "opacity-70" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? <Loader label="Enviando..." /> : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      {children}
    </div>
  );
}
