import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function SuccessStories({ summary = false, showHeader = true }) {
  const navigate = useNavigate();
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonios = async () => {
      setLoading(true);
      const { data: testimoniosData, error: testimoniosError } = await supabase
        .from('entradas_blog')
        .select('titulo, contenido, autor')
        .eq('categoria', 'Testimonios')
        .order('creado_en', { ascending: false });

      if (testimoniosError) {
        console.error('Error al cargar testimonios:', testimoniosError.message);
        setLoading(false);
        return;
      }

      // Obtener correos únicos
      const autoresUnicos = [...new Set(testimoniosData.map(t => t.autor))];

      // Consultar apodos de esos autores en una sola query
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('correo, apodo')
        .in('correo', autoresUnicos);

      if (usuariosError) {
        console.error('Error al obtener apodos:', usuariosError.message);
        setLoading(false);
        return;
      }

      // Mapear correo => apodo
      const apodosMap = {};
      usuariosData.forEach(u => {
        apodosMap[u.correo] = u.apodo;
      });

      // Reemplazar autor por apodo si existe
      const testimoniosConApodo = testimoniosData.map(t => ({
        ...t,
        autor: apodosMap[t.autor] || t.autor || "Anónimo",
      }));

      setTestimonios(testimoniosConApodo);
      setLoading(false);
    };

    fetchTestimonios();
  }, []);

  const testimoniosResumidos = summary ? testimonios.slice(0, 1) : testimonios;

  return (
    <section className="max-w-3xl px-6 py-8 mx-auto bg-white rounded-lg shadow-md">
      {showHeader && (
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-800">Casos de Éxito</h2>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Cargando testimonios...</p>
      ) : testimonios.length === 0 ? (
        <p className="text-center text-gray-500">No hay testimonios disponibles.</p>
      ) : (
        <div className="space-y-6">
          {testimoniosResumidos.map((testimonio, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
              <p className="italic text-gray-800">“{testimonio.contenido}”</p>
              <p className="mt-2 font-semibold">— {testimonio.autor}</p>
            </div>
          ))}
        </div>
      )}

      {summary && testimonios.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/casos-exito')}
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            type="button"
          >
            Ver más testimonios
          </button>
        </div>
      )}
    </section>
  );
}
