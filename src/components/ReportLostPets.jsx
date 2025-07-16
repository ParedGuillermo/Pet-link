import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const provinciasArgentinas = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

function sanitizeFileName(name) {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
}

export default function ModalReportarMascota({ onClose, usuarioId, onMascotaReportada }) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    descripcion: "",
    provincia: "",
    telefono: "",
    sexo: "",
    caracteristicas: "",
    cuidados_especiales: "",
    foto: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      if (files.length > 0) {
        const file = files[0];
        if (!file.type.startsWith("image/")) {
          setError("Solo se permiten archivos de imagen.");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("La imagen debe ser menor a 5MB.");
          return;
        }
        setError(null);
        setForm((prev) => ({ ...prev, foto: file }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioId) {
      setError("Debés iniciar sesión para reportar una mascota.");
      return;
    }

    // Validar campos obligatorios
    if (!form.nombre || !form.especie || !form.provincia || !form.telefono) {
      setError("Por favor, completá todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let foto_url = null;

      if (form.foto) {
        setUploadingImage(true);
        const safeName = sanitizeFileName(form.foto.name);
        const fileName = `${Date.now()}_${safeName}`;
        const { error: uploadError } = await supabase.storage.from("pets").upload(fileName, form.foto);
        setUploadingImage(false);

        if (uploadError) {
          setError(`Error al subir la imagen: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from("pets").getPublicUrl(fileName);
        foto_url = publicUrlData.publicUrl;
      }

      if (!/^\d{6,15}$/.test(form.telefono)) {
        setError("El teléfono debe ser un número válido.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("mascotas").insert({
        nombre: form.nombre,
        especie: form.especie,
        raza: form.raza || null,
        edad: form.edad ? parseInt(form.edad) : null,
        descripcion: form.descripcion || null,
        provincia: form.provincia || null,
        telefono: form.telefono,
        sexo: form.sexo || null,
        caracteristicas: form.caracteristicas || null,
        cuidados_especiales: form.cuidados_especiales || null,
        estado: "reportada",
        foto_url,
        usuario_id: usuarioId,
      });

      if (insertError) {
        setError(`Error al guardar en la base de datos: ${insertError.message}`);
        setLoading(false);
        return;
      }

      // Opcional: resetear form
      setForm({
        nombre: "",
        especie: "",
        raza: "",
        edad: "",
        descripcion: "",
        provincia: "",
        telefono: "",
        sexo: "",
        caracteristicas: "",
        cuidados_especiales: "",
        foto: null,
      });

      if (onMascotaReportada) onMascotaReportada();
      onClose();
    } catch (err) {
      setError(`Error inesperado: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-3xl shadow-xl max-h-[90vh] overflow-auto">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute text-xl font-bold text-gray-500 top-4 right-4 hover:text-red-500"
          aria-label="Cerrar"
        >
          &times;
        </button>

        <h2 className="mb-4 text-2xl font-bold text-center text-blue-700">🐾 Reportar Mascota Perdida</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-gray-800">
          <input
            name="nombre"
            placeholder="Nombre *"
            required
            value={form.nombre}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          <input
            name="especie"
            placeholder="Especie (perro, gato) *"
            required
            value={form.especie}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          <input
            name="raza"
            placeholder="Raza"
            value={form.raza}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          <input
            name="edad"
            type="number"
            min="0"
            placeholder="Edad"
            value={form.edad}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />

          <select
            name="provincia"
            value={form.provincia}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg shadow-sm"
          >
            <option value="">Seleccioná una provincia *</option>
            {provinciasArgentinas.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <input
            name="telefono"
            placeholder="Teléfono *"
            required
            value={form.telefono}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
            inputMode="tel"
          />

          <select
            name="sexo"
            value={form.sexo}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          >
            <option value="">Seleccioná el sexo</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>

          <textarea
            name="caracteristicas"
            placeholder="Características"
            value={form.caracteristicas}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          <textarea
            name="cuidados_especiales"
            placeholder="Cuidados especiales"
            value={form.cuidados_especiales}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm"
          />

          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          {uploadingImage && (
            <p className="text-sm text-blue-600" aria-live="polite">
              Subiendo imagen...
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500" aria-live="polite">
              {error}
            </p>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Reportando..." : "Reportar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
