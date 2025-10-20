"use client";
import { useEffect, useState } from "react";
import { ClockingAPI } from "@/services/api";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/context/ToastContext.jsx";
import { Title } from "@/app/main-page/components";
import { BackButton } from "@/components/ui";

export default function BaterPontoPage() {
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await ClockingAPI.getToday();
      setToday(data);
    } catch (e) {
      toast.show(e?.message || "Erro ao carregar ponto", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (action) => {
    setActing(true);
    try {
      await action();
      toast.show("Registro atualizado", "success");
      await load();
    } catch (e) {
      toast.show(e?.message || "Falha na operação", "error");
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="mb-4 text-center">
          <BackButton />
          <Title>Bater Ponto</Title>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Info label="Início Trabalho" value={today?.startWork} />
              <Info label="Início Almoço" value={today?.startLunch} />
              <Info label="Fim Almoço" value={today?.endLunch} />
              <Info label="Fim Expediente" value={today?.endWork} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              <Action
                label="Início trabalho"
                disabled={acting}
                onClick={() => act(ClockingAPI.startWork)}
              />
              <Action
                label="Início almoço"
                disabled={acting}
                onClick={() => act(ClockingAPI.startLunch)}
              />
              <Action
                label="Fim almoço"
                disabled={acting}
                onClick={() => act(ClockingAPI.endLunch)}
              />
              <Action
                label="Fim expediente"
                disabled={acting}
                onClick={() => act(ClockingAPI.endWork)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-4 border rounded-lg">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold">
        {value ? new Date(value).toLocaleTimeString() : "--:--"}
      </div>
    </div>
  );
}

function Action({ label, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-indigo-600 text-white px-4 py-3 rounded-lg ${
        disabled ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
      }`}
    >
      {label}
    </button>
  );
}
