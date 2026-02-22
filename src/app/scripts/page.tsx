'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TarjetaScript from '@/componentes/TarjetaScript';
import { Plus, FileCode, Sparkles } from 'lucide-react';
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
      setError(null);
      const respuesta = await fetch('/api/scripts');
      const datos = await respuesta.json();
      
      if (datos.error) {
        // Si no hay scripts, no es un error, simplemente no hay datos
        if (datos.datos === null || datos.datos === undefined) {
          setScripts([]);
        } else {
          setError(datos.error);
        }
      } else {
        setScripts(Array.isArray(datos.datos) ? datos.datos : []);
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
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#00ff88] border-t-transparent rounded-full animate-spin" 
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }} />
            <span className="text-gray-400 font-medium">Cargando scripts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 tarjeta">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={cargarScripts} className="btn-primario">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
            Mis Scripts
          </h1>
          <p className="mt-2 text-gray-400">
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
        <div className="text-center py-20 tarjeta">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1))', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
            <FileCode className="w-10 h-10 text-[#00ff88]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            No tienes scripts todavía
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Crea tu primer script para empezar a inyectar código JavaScript en páginas web.
          </p>
          <Link href="/scripts/nuevo" className="btn-primario inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
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
