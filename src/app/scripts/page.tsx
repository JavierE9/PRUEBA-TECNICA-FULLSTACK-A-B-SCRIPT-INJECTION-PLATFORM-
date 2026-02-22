'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TarjetaScript from '@/componentes/TarjetaScript';
import { Plus, FileCode } from 'lucide-react';
import type { Script } from '@/tipos/basedatos';

/**
 * Página de Lista de Scripts - Muestra todos los scripts del usuario
 */
export default function PaginaScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarScripts = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch('/api/scripts');
      const datos = await respuesta.json();
      
      if (datos.error) {
        setError(datos.error);
      } else {
        setScripts(datos.datos || []);
      }
    } catch {
      setError('Error al cargar los scripts');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarScripts();
  }, []);

  const manejarEliminar = (id: string) => {
    setScripts(scripts.filter(script => script.id !== id));
  };

  if (cargando) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Cargando scripts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button onClick={cargarScripts} className="btn-primario mt-4">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Scripts</h1>
          <p className="mt-1 text-gray-600">
            Gestiona tus scripts de inyección A/B
          </p>
        </div>
        <Link href="/scripts/nuevo" className="btn-primario flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nuevo Script
        </Link>
      </div>

      {/* Lista de Scripts */}
      {scripts.length === 0 ? (
        <div className="text-center py-16 tarjeta">
          <FileCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes scripts todavía
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer script para empezar a inyectar código JavaScript en páginas web.
          </p>
          <Link href="/scripts/nuevo" className="btn-primario inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Primer Script
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scripts.map((script) => (
            <TarjetaScript
              key={script.id}
              id={script.id}
              nombre={script.nombre}
              descripcion={script.descripcion}
              estado={script.estado}
              fechaActualizacion={script.fecha_actualizacion}
              idPublico={script.id_publico}
              alEliminar={manejarEliminar}
            />
          ))}
        </div>
      )}
    </div>
  );
}
