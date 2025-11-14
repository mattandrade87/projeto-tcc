"use client";
import { useState } from "react";
import { AuthAPI } from "@/services/api";
import { useToast } from "@/context/ToastContext.jsx";
import Loader from "@/components/ui/Loader";
import { Title } from "@/app/main-page/components";

export default function NewUserPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await AuthAPI.registerUser(form);
      toast.show("Usuário criado", "success");
      setForm({
        firstName: "",
        lastName: "",
        displayName: "",
        email: "",
        password: "",
      });
    } catch (e) {
      toast.show(e?.message || "Erro ao criar usuário", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <div className="mb-4 text-center">
          <Title>Novo Usuário</Title>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Primeiro Nome"
            value={form.firstName}
            onChange={(v) => setForm({ ...form, firstName: v })}
          />
          <Input
            label="Sobrenome"
            value={form.lastName}
            onChange={(v) => setForm({ ...form, lastName: v })}
          />
          <Input
            label="Nome de Exibição"
            value={form.displayName}
            onChange={(v) => setForm({ ...form, displayName: v })}
          />
          <Input
            type="email"
            label="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Input
            type="password"
            label="Senha"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
          />
          <button
            className={`bg-indigo-600 text-white px-6 py-3 rounded-lg w-full ${
              saving ? "opacity-70" : "hover:bg-indigo-700"
            }`}
            disabled={saving}
          >
            {saving ? <Loader label="Salvando..." /> : "Criar"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg"
      />
    </div>
  );
}
