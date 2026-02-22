'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatearTiempoRelativo, obtenerUrlScriptPublico, copiarAlPortapapeles } from '@/lib/utilidades';
import { Copy, ExternalLink, Trash2, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PropsTarjetaScript {
  id: string;
  nombre: string;
  descripcion?: string | null;
  estado: 'borrador' | 'publicado';
  fechaActualizacion: string;
  idPublico: string | null;
  alEliminar?: (id: string) => void;
}

/**
 * Componente Tarjeta de Script - Muestra información resumida de un script
 */
export default function TarjetaScript({
  id,
  nombre,
  descripcion,
  estado,
  fechaActualizacion,
  idPublico,
  alEliminar,
}: PropsTarjetaScript) {
  const [copiado, setCopiado] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const urlPublica = idPublico ? obtenerUrlScriptPublico(idPublico) : null;

  const manejarCopiar = async () => {
    if (!urlPublica) return;
    
    const exito = await copiarAlPortapapeles(urlPublica);
    if (exito) {
      setCopiado(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopiado(false), 2000);
    } else {
      toast.error('Error al copiar la URL');
    }
  };

  const manejarEliminar = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este script?')) return;
    
    setEliminando(true);
    try {
      const respuesta = await fetch(`/api/scripts/${id}`, { method: 'DELETE' });
      if (respuesta.ok) {
        toast.success('Script eliminado correctamente');
        alEliminar?.(id);
      } else {
        toast.error('Error al eliminar el script');
      }
    } catch {
      toast.error('Error al eliminar el script');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="tarjeta hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{nombre}</h3>
            <span className={estado === 'publicado' ? 'badge-publicado' : 'badge-borrador'}>
              {estado === 'publicado' ? 'Publicado' : 'Borrador'}
            </span>
          </div>
          {descripcion && (
            <p className="text-sm text-gray-500 line-clamp-2">{descripcion}</p>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Actualizado {formatearTiempoRelativo(fechaActualizacion)}
      </div>

      {estado === 'publicado' && urlPublica && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <code className="text-xs text-gray-600 truncate flex-1 mr-2">
              {urlPublica}
            </code>
            <button
              onClick={manejarCopiar}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title="Copiar URL"
            >
              {copiado ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
        <Link
          href={`/scripts/${id}`}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Link>
        
        {urlPublica && (
          <a
            href={urlPublica}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Script
          </a>
        )}
        
        <button
          onClick={manejarEliminar}
          disabled={eliminando}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 transition-colors ml-auto disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}
