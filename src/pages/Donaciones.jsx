import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Donaciones() {
  const [organizaciones, setOrganizaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizaciones = async () => {
      const { data, error } = await supabase
        .from("organizaciones")
        .select("*")
        .eq("verificada", true) // ✅ Mostrar solo verificadas
        .order("fecha_registro", { ascending: false });

      if (!error) setOrganizaciones(data);
    };

    fetchOrganizaciones();
  }, []);

  return (
    <div className="p-4 pt-6 pb-20">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Organizaciones que necesitan tu ayuda 🐶❤️
      </h1>

      {organizaciones.length === 0 && (
        <p className="text-center text-gray-500">No hay organizaciones registradas aún.</p>
      )}

      <div className="space-y-4">
        {organizaciones.map((org) => (
          <div key={org.id} className="p-4 bg-white border shadow-md rounded-2xl">
            {org.logo_url && (
              <img
                src={org.logo_url}
                alt={org.nombre}
                className="object-cover w-16 h-16 mb-2 rounded-full"
              />
            )}
            <h2 className="text-xl font-semibold">{org.nombre}</h2>
            <p className="mb-1 text-sm text-gray-600">{org.descripcion}</p>
            <p className="text-sm text-gray-500">📍 {org.ubicacion}</p>
            <p className="text-sm text-gray-500">📞 {org.contacto}</p>
            {org.codigo_donacion && (
              <div className="p-2 mt-2 text-sm bg-gray-100 rounded-lg">
                <p className="font-semibold">Código para donar:</p>
                <p className="text-green-600 break-all">{org.codigo_donacion}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/registrar-organizacion")}
          className="px-4 py-2 font-semibold text-white transition-all bg-green-600 rounded-full shadow hover:bg-green-700"
        >
          Registrar mi organización
        </button>
      </div>
    </div>
  );
}
