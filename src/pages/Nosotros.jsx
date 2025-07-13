import React from 'react';

export default function Nosotros() {
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="max-w-3xl p-8 mx-auto font-sans text-gray-800 bg-white shadow-md rounded-xl">
        <h1 className="mb-6 text-3xl font-bold text-purple-800">¿Quiénes somos?</h1>
        
        <p className="mb-6 leading-relaxed">
          Soy Guillermo, fundador de Pets Link, un proyecto creado con mucho amor y compromiso para facilitar la conexión entre las personas y sus mascotas.
        </p>

        <p className="mb-6 leading-relaxed">
          En Pets Link somos un equipo comprometido con el bienestar animal y la solidaridad comunitaria, y trabajamos para que todas las mascotas que necesiten ayuda puedan recibirla de manera fácil y rápida.
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-purple-700">Nuestra misión</h2>
        <p className="mb-6 leading-relaxed">
          Buscamos facilitar y fomentar las donaciones para animales enfermos, rescatados o que necesiten operaciones, tratamientos o cuidados especiales. También apoyamos campañas de vacunación y otros eventos de salud para mascotas.
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-purple-700">Compromiso y transparencia</h2>
        <p className="mb-6 leading-relaxed">
          Nuestra plataforma es completamente gratuita para quienes la utilizan, sin costos ni suscripciones. No buscamos lucrar con este proyecto; nuestra intención es brindar un espacio seguro y accesible para ayudar a quienes más lo necesitan.
        </p>

        <h2 className="mb-4 text-2xl font-semibold text-purple-700">¿Cómo ayudamos?</h2>
        <p className="mb-6 leading-relaxed">
          Facilitamos que cualquier persona pueda mostrar campañas, difundir casos de mascotas que necesitan ayuda y conectar donantes con quienes están en situación vulnerable. Todo esto para construir una comunidad activa y comprometida con el cuidado animal.
        </p>

        <p className="text-sm text-gray-600">
          Gracias por ser parte de Pets Link y ayudarnos a crear un mundo donde el amor y la solidaridad por los animales sean el motor que nos une. 🐾💜
        </p>
      </div>
    </div>
  );
}
