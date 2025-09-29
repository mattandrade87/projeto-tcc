export default function RelatorioCard({
  hora,
  id,
  data,
  endereco = "Rua Tancredo Neves, 123 - Ipatinga, MG",
}) {
  return (
    <div className="bg-gray-200 rounded-lg shadow-md p-4 mb-4 text-left">
      <h2 className="text-xl text-gray-700 font-semibold">
        Relatório de Ponto - {id}
      </h2>
      <p className="text-gray-500">
        Você bateu o ponto às {hora} na data {data}.
      </p>
      <p className="text-gray-500">Localização: {endereco}</p>
    </div>
  );
}
