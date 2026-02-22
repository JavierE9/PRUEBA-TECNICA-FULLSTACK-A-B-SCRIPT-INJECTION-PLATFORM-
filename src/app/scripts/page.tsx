'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TarjetaScript from '@/componentes/TarjetaScript';
import Paginacion from '@/componentes/Paginacion';
import { Plus, FileCode, Sparkles, Search, X } from 'lucide-react';
import type { Script } from '@/tipos/basedatos';
import { servicioScripts } from '@/lib/servicioScripts';

/**
 * Página de Lista de Scripts - Muestra todos los scripts del usuario con búsqueda y paginación
 */
export default function PaginaScripts() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaTemporal, setBusquedaTemporal] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [total, setTotal] = useState(0);
  const SCRIPTS_POR_PAGINA = 9;

  const cargarScripts = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const { datos, error: errorBusqueda } = await servicioScripts.buscar(
        busqueda,
        paginaActual,
        SCRIPTS_POR_PAGINA
      );

      if (errorBusqueda) {
        setError(errorBusqueda);
        setScripts([]);
      } else if (datos) {
        setScripts(datos.scripts);
        setTotal(datos.total);
        setTotalPaginas(datos.totalPaginas);
      }
    } catch {
      setError('Error al cargar los scripts');
      setScripts([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarScripts();
  }, [busqueda, paginaActual]);

  const manejarBusqueda = (e: React.FormEvent) => {
    e.preventDefault();
    setBusqueda(busquedaTemporal);
    setPaginaActual(1); // Resetear a la primera página al buscar
  };

  const limpiarBusqueda = () => {
    setBusquedaTemporal('');
    setBusqueda('');
    setPaginaActual(1);
  };

  const manejarEliminar = (id: string) => {
    setScripts(scripts.filter(script => script.id !== id));
    setTotal(prev => prev - 1);
    // Recargar si eliminamos el último script de la página y no estamos en la primera
    if (scripts.length === 1 && paginaActual > 1) {
      setPaginaActual(prev => prev - 1);
    }
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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

      {/* Barra de Búsqueda */}
      <div className="mb-8">
        <form onSubmit={manejarBusqueda} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busquedaTemporal}
              onChange={(e) => setBusquedaTemporal(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl
                         text-white placeholder-gray-400 focus:outline-none focus:border-[#00ff88]/50
                         transition-colors duration-200"
            />
            {busquedaTemporal && (
              <button
                type="button"
                onClick={limpiarBusqueda}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white
                           transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button type="submit" className="sr-only">Buscar</button>
        </form>
        
        {/* Información de resultados */}
        {!cargando && !error && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <p className="text-gray-400">
              {total === 0 ? (
                'No se encontraron scripts'
              ) : (
                <>
                  Mostrando <span className="text-[#00ff88] font-semibold">{scripts.length}</span> de{' '}
                  <span className="text-[#00ff88] font-semibold">{total}</span>{' '}
                  {total === 1 ? 'script' : 'scripts'}
                  {busqueda && (
                    <>
                      {' '}para "<span className="text-white font-medium">{busqueda}</span>"
                    </>
                  )}
                </>
              )}
            </p>
            {totalPaginas > 1 && (
              <p className="text-gray-500">
                Página {paginaActual} de {totalPaginas}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lista de Scripts */}
      {scripts.length === 0 && !cargando && !error ? (
        <div className="text-center py-20 tarjeta">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1))', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
            {busqueda ? <Search className="w-10 h-10 text-[#00ff88]" /> : <FileCode className="w-10 h-10 text-[#00ff88]" />}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            {busqueda ? 'No se encontraron resultados' : 'No tienes scripts todavía'}
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {busqueda
              ? `No hay scripts que coincidan con "${busqueda}". Intenta con otros términos de búsqueda.`
              : 'Crea tu primer script para empezar a inyectar código JavaScript en páginas web.'}
          </p>
          {busqueda ? (
            <button onClick={limpiarBusqueda} className="btn-secundario inline-flex items-center gap-2">
              <X className="w-5 h-5" />
              Limpiar Búsqueda
            </button>
          ) : (
            <Link href="/scripts/nuevo" className="btn-primario inline-flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Crear Primer Script
            </Link>
          )}
        </div>
      ) : (
        <>
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

          {/* Paginación */}
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={setPaginaActual}
          />
        </>
      )}
    </div>
  );
}
