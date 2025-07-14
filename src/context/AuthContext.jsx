import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión al cargar la app
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user;
      if (sessionUser) {
        setUser(sessionUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    // Escuchar cambios en la sesión
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login con email y password
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) throw error;
    setUser(data.user);
    setIsLoggedIn(true);
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
  };

  // Registro y creación en tabla usuarios
  const register = async (email, password, nombre, apellido) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;

    const user = data?.user;
    console.log("🧪 USER DESPUÉS DE REGISTRO:", user); // <-- Log importante para depurar

    if (user) {
      // Insertar usuario con más datos en la tabla 'usuarios'
      const { error: insertError } = await supabase
        .from("usuarios")
        .insert([
          {
            id: user.id,               // UUID de auth
            correo: user.email,         // Email del usuario
            nombre: nombre,             // Nombre
            apellido: apellido,         // Apellido
            // Agregar más campos si lo necesitas, como 'telefono', 'avatar_url', etc.
          },
        ]);

      if (insertError) {
        console.error("❌ Error al insertar en usuarios:", insertError); // <-- Log de error
        throw insertError;
      }
    }

    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
