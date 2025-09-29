import BackButton from "../ui/BackButton";
import RelatorioCard from "./components/RelatorioCard";

export default function Relatorios() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white text-center rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
        <BackButton />
        <h1 className="text-2xl text-gray-800  font-semibold underline mb-6">
          Relatórios - Jorge Almeida
        </h1>

        <div className="overflow-y-auto flex-1 pr-2">
          <RelatorioCard hora="18:00" id="310" data="2025-03-14" />
          <RelatorioCard hora="13:30" id="309" data="2025-03-14" />
          <RelatorioCard hora="12:00" id="308" data="2025-03-14" />
          <RelatorioCard hora="08:00" id="307" data="2025-03-14" />
          <RelatorioCard hora="18:00" id="306" data="2025-03-13" />
          <RelatorioCard hora="13:30" id="305" data="2025-03-13" />
        </div>
      </div>
    </div>
  );
}
