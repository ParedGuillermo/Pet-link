// src/pages/AdminPanel.jsx
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

    const { data: usuariosData } = await supabase.from("usuarios").select("*");
    const { data: mascotasData } = await supabase.from("mascotas").select("*");

    const { data: organizacionesData } = await supabase
      .from("organizaciones")
      .select("*")
      .eq("verificada", false)
      .order("fecha_registro", { ascending: false });

    const { data: orgsVerificadas } = await supabase
      .from("organizaciones")
      .select("*")
      .eq("verificada", true)
      .order("fecha_registro", { ascending: false });

    setUsuarios(usuariosData || []);
    setMascotas(mascotasData || []);
    setOrganizaciones(organizacionesData || []);
    setOrganizacionesVerificadas(orgsVerificadas || []);
    setLoading(false);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    await supabase.from("usuarios").delete().eq("id", id);
    fetchData();
  };

  const handleDeleteMascota = async (id) => {
    if (!window.confirm("¿Eliminar esta mascota?")) return;
    await supabase.from("mascotas").delete().eq("id", id);
    fetchData();
  };

  const handleDeleteOrganizacion = async (id) => {
    if (!window.confirm("¿Eliminar esta organización?")) return;
    await supabase.from("organizaciones").delete().eq("id", id);
    fetchData();
  };

  const handleUpdateUser = async () => {
    const { id, ...data } = editingUser;
    await supabase.from("usuarios").update(data).eq("id", id);
    setEditingUser(null);
    fetchData();
  };

  const handleUpdateMascota = async () => {
    const { id, ...data } = editingPet;
    await supabase.from("mascotas").update(data).eq("id", id);
    setEditingPet(null);
    fetchData();
  };

  const aprobarOrganizacion = async (id) => {
    const { error } = await supabase
      .from("organizaciones")
      .update({ verificada: true })
      .eq("id", id);

    if (!error) {
      setMensaje("Organización aprobada.");
      fetchData();
      setTimeout(() => setMensaje(""), 2000);
    } else {
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
          {/* Usuarios */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Usuarios</h2>
            <div className="overflow-auto max-h-[300px] border rounded bg-white p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2">ID</th>
                    <th className="px-2">Correo</th>
                    <th className="px-2">Nombre</th>
                    <th className="px-2">Apellido</th>
                    <th className="px-2">Rol</th>
                    <th className="px-2">Suscripción</th>
                    <th className="px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.id}>
                      <td className="px-2">{u.id}</td>
                      <td className="px-2">{u.correo}</td>
                      <td className="px-2">{u.nombre}</td>
                      <td className="px-2">{u.apellido}</td>
                      <td className="px-2">{u.rol}</td>
                      <td className="px-2">{u.suscripcion}</td>
                      <td className="px-2 space-x-2">
                        <button onClick={() => setEditingUser(u)} className="text-sm text-blue-600">Editar</button>
                        <button onClick={() => handleDeleteUser(u.id)} className="text-sm text-red-600">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mascotas */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Mascotas</h2>
            <div className="overflow-auto max-h-[300px] border rounded bg-white p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-2">ID</th>
                    <th className="px-2">Nombre</th>
                    <th className="px-2">Especie</th>
                    <th className="px-2">Raza</th>
                    <th className="px-2">Edad</th>
                    <th className="px-2">Estado</th>
                    <th className="px-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mascotas.map((m) => (
                    <tr key={m.id}>
                      <td className="px-2">{m.id}</td>
                      <td className="px-2">{m.nombre}</td>
                      <td className="px-2">{m.especie}</td>
                      <td className="px-2">{m.raza}</td>
                      <td className="px-2">{m.edad}</td>
                      <td className="px-2">{m.estado}</td>
                      <td className="px-2 space-x-2">
                        <button onClick={() => setEditingPet(m)} className="text-sm text-blue-600">Editar</button>
                        <button onClick={() => handleDeleteMascota(m.id)} className="text-sm text-red-600">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

          {/* Organizaciones Verificadas */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">Organizaciones Activas</h2>
            {organizacionesVerificadas.length === 0 ? (
              <p className="text-gray-500">No hay organizaciones activas.</p>
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

          {/* Edición Usuario */}
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

          {/* Edición Mascota */}
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
