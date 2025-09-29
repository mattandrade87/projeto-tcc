"use client";
import { useEffect, useRef, useState } from "react";

function BackButton() {
  return (
    <button
      type="button"
      aria-label="Voltar"
      className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 rounded-full p-2 mb-4 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      style={{
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => window.history.back()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

function Title({ children }) {
  return <h1 className="text-2xl font-bold">{children}</h1>;
}

function Loader() {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <span>Carregando mapa...</span>
    </div>
  );
}

function MapLeaflet({
  center = [-23.5505, -46.6333],
  zoom = 13,
  height = "30vh",
}) {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const leafletCss = document.createElement("link");
    leafletCss.rel = "stylesheet";
    leafletCss.href = "https://unpkg.com/leaflet/dist/leaflet.css";
    document.head.appendChild(leafletCss);

    const leafletScript = document.createElement("script");
    leafletScript.src = "https://unpkg.com/leaflet/dist/leaflet.js";
    leafletScript.async = true;
    leafletScript.onload = () => {
      if (window.L && mapRef.current) {
        const map = window.L.map(mapRef.current).setView(center, zoom);
        window.L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map);
        // Adiciona marcador central
        window.L.marker(center).addTo(map);
        setMapLoaded(true);
      }
    };
    document.body.appendChild(leafletScript);

    return () => {
      document.head.removeChild(leafletCss);
      document.body.removeChild(leafletScript);
    };
  }, [center, zoom]);

  return (
    <div style={{ position: "relative", width: "100%", height }}>
      {!mapLoaded && <Loader />}
      <div
        ref={mapRef}
        id="map-container"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "1rem",
          opacity: mapLoaded ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
    </div>
  );
}

export default function BaterPonto() {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
      });
      setDateTime(formatted);
    };

    updateDateTime(); // primeira renderização
    const interval = setInterval(updateDateTime, 1000); // atualiza a cada 1s

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <BackButton />
        <div className="flex items-center mb-6">
          <div className="flex-1 text-center">
            <Title>Jorge Almeida</Title>
          </div>
        </div>
        <MapLeaflet />

        <div className="text-center mt-6">
          {/* Data e hora */}
          <p className="text-gray-600 mb-3 font-medium">{dateTime}</p>

          {/* Botão */}
          <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 p-3 rounded text-white px-6 w-full">
            Bater Ponto
          </button>
        </div>
      </div>
    </div>
  );
}
