"use client";
import { useEffect, useState } from "react";
import { AuthAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";

export default function SupabaseAdminUsersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await AuthAPI.supabaseAdminUsers();
        setItems(Array.isArray(data?.users) ? data.users : data);
      } catch (e) {
        toast.show(e?.message || "Erro ao buscar usuários Supabase", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-5xl">
        <div className="mb-4 text-center">
          <Title>Supabase Admin: Users</Title>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <Th>ID</Th>
                  <Th>Email</Th>
                  <Th>Criado em</Th>
                </tr>
              </thead>
              <tbody>
                {items?.map((u) => (
                  <tr key={u.id} className="border-t">
                    <Td>{u.id}</Td>
                    <Td>{u.email}</Td>
                    <Td>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleString()
                        : ""}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-4 py-2 text-sm font-semibold text-gray-700">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="px-4 py-2 text-sm">{children}</td>;
}
