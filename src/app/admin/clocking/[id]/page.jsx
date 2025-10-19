"use client";
import { useEffect, useState } from "react";
import { ClockingAPI } from "@/services/api";
import { useToast } from "@/context/ToastContext.jsx";
import { useParams } from "next/navigation";
import Loader from "@/app/ui/Loader.jsx";
import { Title } from "@/app/main-page/components";

export default function ClockingByIdPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const d = await ClockingAPI.getById(id);
        setData(d);
      } catch (e) {
        toast.show(e?.message || "Erro ao carregar ponto", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xl">
        <div className="mb-4 text-center">
          <Title>Ponto #{id}</Title>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div className="space-y-2">
            <Row label="Usuário" value={data?.user?.name || data?.userId} />
            <Row
              label="Data"
              value={data?.date ? new Date(data.date).toLocaleDateString() : ""}
            />
            <Row
              label="Início"
              value={
                data?.startWork
                  ? new Date(data.startWork).toLocaleTimeString()
                  : "--"
              }
            />
            <Row
              label="Início almoço"
              value={
                data?.startLunch
                  ? new Date(data.startLunch).toLocaleTimeString()
                  : "--"
              }
            />
            <Row
              label="Fim almoço"
              value={
                data?.endLunch
                  ? new Date(data.endLunch).toLocaleTimeString()
                  : "--"
              }
            />
            <Row
              label="Fim"
              value={
                data?.endWork
                  ? new Date(data.endWork).toLocaleTimeString()
                  : "--"
              }
            />
            <Row label="Status" value={data?.status} />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b py-2">
      <div className="text-gray-600">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
