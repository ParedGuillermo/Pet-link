import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const provinciasArgentinas = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
];

// Función para limpiar nombre de archivo
function sanitizeFileName(name) {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
}

export default function ModalRegistrarMascota({ onClose, usuarioId, onMascotaAgregada }) {
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
    estado: "propia",
    foto: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm((prev) => ({ ...prev, foto: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let foto_url = null;

      if (form.foto) {
        setUploadingImage(true);
        const safeName = sanitizeFileName(form.foto.name);
        const fileName = `${Date.now()}_${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("pets")  // <-- Acá cambiamos a bucket "pets"
          .upload(fileName, form.foto);

        setUploadingImage(false);

        if (uploadError) {
          setError(`Error al subir la imagen: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from("pets") // <-- también acá
          .getPublicUrl(fileName);

        foto_url = publicUrlData.publicUrl;
      }

      if (!/^\d{6,15}$/.test(form.telefono)) {
        setError("El teléfono debe ser un número válido (sin espacios ni símbolos).");
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
        sexo: form.sexo,
        caracteristicas: form.caracteristicas || null,
        cuidados_especiales: form.cuidados_especiales || null,
        estado: form.estado,
        foto_url,
        usuario_id: usuarioId,
      });

      if (insertError) {
        setError(`Error al insertar en la base de datos: ${insertError.message}`);
        console.error(insertError);
        return;
      }

      if (onMascotaAgregada) onMascotaAgregada();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh] pb-16"> {/* Añadir padding-bottom aquí */}
        <h2 className="mb-4 text-xl font-semibold text-center">Registrar Mascota</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" placeholder="Nombre *" required value={form.nombre} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="especie" placeholder="Especie (ej: perro, gato) *" required value={form.especie} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="raza" placeholder="Raza" value={form.raza} onChange={handleChange} className="w-full p-2 border rounded" />
          <input name="edad" type="number" min="0" placeholder="Edad" value={form.edad} onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="provincia" value={form.provincia} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="" disabled>Seleccioná una provincia *</option>
            {provinciasArgentinas.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>

          <input name="telefono" placeholder="Teléfono *" required value={form.telefono} onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="sexo" value={form.sexo} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="" disabled>Seleccioná el sexo *</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>

          <textarea name="caracteristicas" placeholder="Características" value={form.caracteristicas} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="cuidados_especiales" placeholder="Cuidados especiales" value={form.cuidados_especiales} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="estado" value={form.estado} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="propia">Propia</option>
            <option value="en_adopcion">En adopción</option>
          </select>

          <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full" />

          {uploadingImage && <p className="text-sm text-blue-600">Subiendo imagen...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400" disabled={loading}>Cancelar</button>
            <button type="submit" disabled={loading || uploadingImage} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              {loading ? "Guardando..." : "Guardar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
