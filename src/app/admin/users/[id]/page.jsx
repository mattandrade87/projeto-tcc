"use client";
import { useEffect, useState } from "react";
import { AdminAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import { useParams, useRouter } from "next/navigation";
import { Title } from "@/app/main-page/components";

export default function UserDetailsPage() {
  const params = useParams();
  const id = params?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const data = await AdminAPI.getUserById(id);
        setUser(data);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar usuário", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await AdminAPI.updateUserById(id, {
        name: user.name,
        email: user.email,
        role: user.role,
      });
      toast.show("Usuário atualizado", "success");
      router.back();
    } catch (e) {
      toast.show(e?.message || "Erro ao atualizar", "error");
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <div className="mb-4 text-center">
          <Title>Editar Usuário</Title>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Nome">
            <input
              className="w-full px-4 py-3 border rounded-lg"
              value={user?.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-lg"
              value={user?.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </Field>
          <Field label="Papel">
            <select
              className="w-full px-4 py-3 border rounded-lg"
              value={user?.role || "USER"}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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
