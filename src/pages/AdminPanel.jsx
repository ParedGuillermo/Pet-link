import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [organizaciones, setOrganizaciones] = useState([]);
  const [organizacionesVerificadas, setOrganizacionesVerificadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editingPet, setEditingPet] = useState(null);

  const isAdmin = user?.email === "walterguillermopared@gmail.com";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: usuariosData, error: usuariosError } = await supabase.from("usuarios").select("*");
      const { data: mascotasData, error: mascotasError } = await supabase.from("mascotas").select("*");
      const { data: organizacionesData, error: orgsError } = await supabase
        .from("organizaciones")
        .select("*")
        .eq("verificada", false)
        .order("fecha_registro", { ascending: false });
      const { data: orgsVerificadas, error: orgsVerificadasError } = await supabase
        .from("organizaciones")
        .select("*")
        .eq("verificada", true)
        .order("fecha_registro", { ascending: false });

      if (usuariosError || mascotasError || orgsError || orgsVerificadasError) {
        throw new Error("Error al cargar los datos.");
      }

      setUsuarios(usuariosData || []);
      setMascotas(mascotasData || []);
      setOrganizaciones(organizacionesData || []);
      setOrganizacionesVerificadas(orgsVerificadas || []);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      setMensaje("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const { error } = await supabase.from("usuarios").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("Hubo un error al eliminar el usuario.");
    }
  };

  const handleDeleteMascota = async (id) => {
    if (!window.confirm("¿Eliminar esta mascota?")) return;
    try {
      const { error } = await supabase.from("mascotas").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error al eliminar la mascota:", error);
      alert("Hubo un error al eliminar la mascota.");
    }
  };

  const handleDeleteOrganizacion = async (id) => {
    if (!window.confirm("¿Eliminar esta organización?")) return;
    try {
      const { error } = await supabase.from("organizaciones").delete().eq("id", id);
      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error("Error al eliminar la organización:", error);
      alert("Hubo un error al eliminar la organización.");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser?.nombre || !editingUser?.apellido) {
      alert("Por favor, completa los campos necesarios.");
      return;
    }
    const { id, ...data } = editingUser;
    try {
      const { error } = await supabase.from("usuarios").update(data).eq("id", id);
      if (error) throw error;
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un error al actualizar el usuario.");
    }
  };

  const handleUpdateMascota = async () => {
    if (!editingPet?.nombre || !editingPet?.raza) {
      alert("Por favor, completa los campos necesarios.");
      return;
    }
    const { id, ...data } = editingPet;
    try {
      const { error } = await supabase.from("mascotas").update(data).eq("id", id);
      if (error) throw error;
      setEditingPet(null);
      fetchData();
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
      alert("Hubo un error al actualizar la mascota.");
    }
  };

  const aprobarOrganizacion = async (id) => {
    try {
      const { error } = await supabase
        .from("organizaciones")
        .update({ verificada: true })
        .eq("id", id);

      if (error) {
        setMensaje("Error al aprobar la organización.");
      } else {
        setMensaje("Organización aprobada.");
      }

      fetchData();
      setTimeout(() => setMensaje(""), 2000);
    } catch (error) {
      console.error("Error al aprobar la organización:", error);
      setMensaje("Error al aprobar la organización.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p>No estás autorizado para acceder a esta página.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="mb-6 text-4xl font-bold">Panel de Administración</h1>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          {/* Edición Usuario y Mascota */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Editar Usuario</h2>
            {editingUser && (
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 text-xl font-bold">Editar Usuario</h3>
                <input
                  type="text"
                  value={editingUser.nombre}
                  onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 mb-2 border"
                />
                <input
                  type="text"
                  value={editingUser.apellido}
                  onChange={(e) => setEditingUser({ ...editingUser, apellido: e.target.value })}
                  placeholder="Apellido"
                  className="w-full p-2 mb-2 border"
                />
                <button onClick={handleUpdateUser} className="px-4 py-2 mr-2 text-white bg-green-600 rounded">Guardar</button>
                <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              </div>
            )}

            <h2 className="mb-4 text-2xl font-semibold">Editar Mascota</h2>
            {editingPet && (
              <div className="p-4 mb-6 bg-white rounded shadow">
                <h3 className="mb-2 text-xl font-bold">Editar Mascota</h3>
                <input
                  type="text"
                  value={editingPet.nombre}
                  onChange={(e) => setEditingPet({ ...editingPet, nombre: e.target.value })}
                  placeholder="Nombre"
                  className="w-full p-2 mb-2 border"
                />
                <input
                  type="text"
                  value={editingPet.raza}
                  onChange={(e) => setEditingPet({ ...editingPet, raza: e.target.value })}
                  placeholder="Raza"
                  className="w-full p-2 mb-2 border"
                />
                <button onClick={handleUpdateMascota} className="px-4 py-2 mr-2 text-white bg-green-600 rounded">Guardar</button>
                <button onClick={() => setEditingPet(null)} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
              </div>
            )}
          </section>

          {/* Organizaciones Aprobadas */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Organizaciones Aprobadas</h2>
            {organizacionesVerificadas.length === 0 ? (
              <p className="text-gray-500">No hay organizaciones aprobadas.</p>
            ) : (
              <div className="space-y-4">
                {organizacionesVerificadas.map((org) => (
                  <div key={org.id} className="p-4 bg-white border shadow rounded-xl">
                    <h3 className="text-lg font-semibold">{org.nombre}</h3>
                    <p className="text-sm text-gray-600">{org.descripcion}</p>
                    <p className="text-sm text-gray-500">📍 {org.ubicacion}</p>
                    <p className="text-sm text-gray-500">📞 {org.contacto}</p>
                    {org.codigo_donacion && (
                      <p className="mt-1 text-sm text-green-600 break-all">💸 {org.codigo_donacion}</p>
                    )}
                    <button
                      onClick={() => handleDeleteOrganizacion(org.id)}
                      className="px-4 py-2 mt-2 text-white bg-red-600 rounded-full hover:bg-red-700"
                    >
                      Eliminar organización
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Organizaciones Pendientes */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Organizaciones Pendientes</h2>
            {organizaciones.length === 0 ? (
              <p className="text-gray-500">No hay organizaciones para verificar.</p>
            ) : (
              <div className="space-y-4">
                {organizaciones.map((org) => (
                  <div key={org.id} className="p-4 bg-white border shadow rounded-xl">
                    <h3 className="text-lg font-semibold">{org.nombre}</h3>
                    <p className="text-sm text-gray-600">{org.descripcion}</p>
                    <p className="text-sm text-gray-500">📍 {org.ubicacion}</p>
                    <p className="text-sm text-gray-500">📞 {org.contacto}</p>
                    {org.codigo_donacion && (
                      <p className="mt-1 text-sm text-green-600 break-all">💸 {org.codigo_donacion}</p>
                    )}
                    <button
                      onClick={() => aprobarOrganizacion(org.id)}
                      className="px-4 py-2 mt-2 text-white bg-green-600 rounded-full hover:bg-green-700"
                    >
                      Aprobar organización
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Usuarios Activos */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Usuarios Activos</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {usuarios.map((u) => (
                <div key={u.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{u.nombre} {u.apellido}</h3>
                  <p className="text-sm text-gray-600">Correo: {u.correo}</p>
                  <p className="text-sm text-gray-500">Rol: {u.rol}</p>
                  <div className="mt-4 space-x-2">
                    <button onClick={() => setEditingUser(u)} className="text-sm text-blue-600">Editar</button>
                    <button onClick={() => handleDeleteUser(u.id)} className="text-sm text-red-600">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mascotas Propias */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Mascotas Propias</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mascotas.filter(m => m.estado === "propia").map((m) => (
                <div key={m.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{m.nombre}</h3>
                  <p className="text-sm text-gray-600">Especie: {m.especie}</p>
                  <p className="text-sm text-gray-500">Edad: {m.edad}</p>
                  <p className="text-sm text-gray-500">Estado: {m.estado}</p>
                  <div className="mt-4 space-x-2">
                    <button onClick={() => setEditingPet(m)} className="text-sm text-blue-600">Editar</button>
                    <button onClick={() => handleDeleteMascota(m.id)} className="text-sm text-red-600">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mascotas en Adopción */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Mascotas en Adopción</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mascotas.filter(m => m.estado === "en_adopcion").map((m) => (
                <div key={m.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{m.nombre}</h3>
                  <p className="text-sm text-gray-600">Especie: {m.especie}</p>
                  <p className="text-sm text-gray-500">Edad: {m.edad}</p>
                  <p className="text-sm text-gray-500">Estado: {m.estado}</p>
                  <div className="mt-4 space-x-2">
                    <button onClick={() => setEditingPet(m)} className="text-sm text-blue-600">Editar</button>
                    <button onClick={() => handleDeleteMascota(m.id)} className="text-sm text-red-600">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mascotas Perdidas */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Mascotas Perdidas</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mascotas.filter(m => m.estado === "perdida").map((m) => (
                <div key={m.id} className="p-4 bg-white border shadow rounded-xl">
                  <h3 className="text-lg font-semibold">{m.nombre}</h3>
                  <p className="text-sm text-gray-600">Especie: {m.especie}</p>
                  <p className="text-sm text-gray-500">Edad: {m.edad}</p>
                  <p className="text-sm text-gray-500">Estado: {m.estado}</p>
                  <div className="mt-4 space-x-2">
                    <button onClick={() => setEditingPet(m)} className="text-sm text-blue-600">Editar</button>
                    <button onClick={() => handleDeleteMascota(m.id)} className="text-sm text-red-600">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-6 py-3 mt-8 text-white transition bg-red-600 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </>
      )}
    </div>
  );
}
