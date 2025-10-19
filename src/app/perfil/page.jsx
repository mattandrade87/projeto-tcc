"use client";
import { useEffect, useState } from "react";
import { UserAPI } from "@/services/api";
import Loader from "@/app/ui/Loader.jsx";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function PerfilPage() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const me = await UserAPI.getMe();
        setForm({ name: me?.name || "", email: me?.email || "" });
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar perfil", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await UserAPI.updateMe(form);
      toast.show("Perfil atualizado", "success");
    } catch (e) {
      toast.show(e?.message || "Erro ao salvar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-4 text-center">
          <Title>Meu Perfil</Title>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nome">
            <input
              className="w-full px-4 py-3 border rounded-lg"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <button
            type="submit"
            disabled={saving}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg w-full ${
              saving ? "opacity-70" : "hover:bg-indigo-700"
            }`}
          >
            {saving ? <Loader label="Salvando..." /> : "Salvar"}
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
