"use client";
import { useState } from "react";
import { AuthAPI } from "@/services/api";
import { useToast } from "@/context/ToastContext.jsx";
import Loader from "@/components/ui/Loader";
import { Title } from "@/app/main-page/components";

export default function UpdatePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      toast.show("Senhas não conferem", "warning");
      return;
    }
    setLoading(true);
    try {
      await AuthAPI.updatePassword({ currentPassword, newPassword });
      toast.show("Senha atualizada", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e) {
      toast.show(e?.message || "Erro ao atualizar senha", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-4 text-center">
          <Title>Alterar Senha</Title>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Senha atual">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </Field>
          <Field label="Nova senha">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </Field>
          <Field label="Confirmar nova senha">
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </Field>
          <button
            disabled={loading}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg w-full ${
              loading ? "opacity-70" : "hover:bg-indigo-700"
            }`}
          >
            {loading ? <Loader label="Salvando..." /> : "Salvar"}
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
