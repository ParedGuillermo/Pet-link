import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedPets from '../components/FeaturedPets';
import EsencialesCarousel from '../components/EsencialesCarousel';
// import LostPetsMap from '../components/LostPetsMap';
import PetSociety from '../components/PetSociety';
import SuccessStories from '../components/SuccessStories';
import TrackingDevices from '../components/TrackingDevices';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      {/* Hero */}
      <HeroSection onReportClick={() => navigate('/reportar-perdida')} />

      {/* Botón para escanear código QR */}
      <section className="flex justify-center px-6 py-6">
        <button
          onClick={() => navigate('/scan')}
          className="w-full max-w-xs px-6 py-4 text-lg font-semibold text-white transition bg-blue-600 rounded-full shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Escanear código QR"
          type="button"
        >
          Escanear código QR
        </button>
      </section>

      {/* Botones de login y registro (si no está logueado) */}
      {!isLoggedIn && (
        <section className="flex justify-center gap-6 px-6 py-4 mb-10">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 max-w-xs px-5 py-3 text-lg font-semibold text-center text-white transition bg-green-600 rounded-full shadow-md hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate('/register')}
            className="flex-1 max-w-xs px-5 py-3 text-lg font-semibold text-center text-white transition bg-purple-600 rounded-full shadow-md hover:bg-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            type="button"
          >
            Registrarse
          </button>
        </section>
      )}

      {/* Mascotas Destacadas - Resumen */}
      <section className="px-6 py-10 mx-auto bg-white shadow-lg rounded-t-xl max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide text-purple-800">Mascotas Destacadas</h2>
          <button
            onClick={() => navigate('/mascotas-destacadas')}
            className="text-sm font-semibold text-blue-600 hover:underline"
            type="button"
          >
            Ver más
          </button>
        </div>
        <FeaturedPets summary={true} maxItems={3} />
      </section>

      {/* Productos Esenciales - Resumen */}
      <section className="px-6 py-10 mx-auto mt-10 shadow-sm bg-gray-50 rounded-xl max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide text-purple-800">Productos Esenciales</h2>
          <button
            onClick={() => navigate('/productos')}
            className="text-sm font-semibold text-blue-600 hover:underline"
            type="button"
          >
            Ver más
          </button>
        </div>
        <EsencialesCarousel summary={true} maxItems={5} />
      </section>

      {/* Tarjeta Quiénes Somos */}
      <section className="max-w-3xl p-8 mx-auto my-12 transition-shadow bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg">
        <Link to="/nosotros" className="block">
          <h2 className="mb-3 text-3xl font-extrabold text-purple-800">Conocé más sobre Pet Link</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Descubrí quiénes somos, nuestra misión y los valores que nos guían para cuidar a tus mascotas.
          </p>
          <button className="px-6 py-3 mt-6 font-semibold text-white transition bg-purple-600 rounded-full shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
            Ir a Nosotros
          </button>
        </Link>
      </section>

      {/* Tarjeta Donaciones */}
      <section className="max-w-3xl p-8 mx-auto my-12 transition-shadow bg-white shadow-md cursor-pointer rounded-xl hover:shadow-lg">
        <Link to="/donaciones" className="block">
          <h2 className="mb-3 text-3xl font-extrabold text-purple-800">Ayudá a las organizaciones</h2>
          <p className="text-lg leading-relaxed text-gray-700">
            Conocé las organizaciones que necesitan donaciones y cómo podés colaborar con ellas.
          </p>
          <button className="px-6 py-3 mt-6 font-semibold text-white transition bg-green-600 rounded-full shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Ir a Donaciones
          </button>
        </Link>
      </section>

      {/* Pet Society - Resumen */}
      <section className="px-6 py-10 mx-auto mt-10 bg-white shadow-sm rounded-xl max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide text-purple-800">Pet Society</h2>
          <button
            onClick={() => navigate('/pet-society')}
            className="text-sm font-semibold text-blue-600 hover:underline"
            type="button"
          >
            Ver más
          </button>
        </div>
        <PetSociety summary={true} maxItems={3} />
      </section>

      {/* Casos de Éxito - Resumen */}
      <section className="px-6 py-10 mx-auto mt-10 shadow-md bg-gray-50 rounded-xl max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide text-purple-800">Casos de Éxito</h2>
          <button
            onClick={() => navigate('/casos-exito')}
            className="text-sm font-semibold text-blue-600 hover:underline"
            type="button"
          >
            Ver más
          </button>
        </div>
        <SuccessStories summary={true} maxItems={3} />
      </section>

      {/* Dispositivos de Rastreo - Resumen */}
      <section className="px-6 py-10 mx-auto mt-10 mb-16 bg-white shadow-sm rounded-b-xl max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-wide text-purple-800">Dispositivos de Rastreo</h2>
          <button
            onClick={() => navigate('/dispositivos')}
            className="text-sm font-semibold text-blue-600 hover:underline"
            type="button"
          >
            Ver más
          </button>
        </div>
        <TrackingDevices summary={true} maxItems={5} />
      </section>
    </div>
  );
}
