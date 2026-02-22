'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatearTiempoRelativo, obtenerUrlScriptPublico, copiarAlPortapapeles } from '@/lib/utilidades';
import { Copy, Eye, Trash2, Edit, Check } from 'lucide-react';
import { toast } from 'sonner';
import ModalConfirmacion from './ModalConfirmacion';

interface PropsTarjetaScript {
  id: string;
  nombre: string;
  descripcion: string;
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
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);

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
    <div className="tarjeta group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-[#00ff88] transition-colors">{nombre}</h3>
            <span className={estado === 'publicado' ? 'badge-publicado' : 'badge-borrador'}>
              {estado === 'publicado' ? 'Publicado' : 'Borrador'}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">{descripcion}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Actualizado {formatearTiempoRelativo(fechaActualizacion)}
      </div>

      {estado === 'publicado' && urlPublica && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'rgba(0, 255, 136, 0.05)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
          <div className="flex items-center justify-between">
            <code className="text-xs text-[#00ff88] truncate flex-1 mr-2 font-mono">
              {urlPublica}
            </code>
            <button
              onClick={manejarCopiar}
              className="p-1.5 hover:bg-[rgba(0,255,136,0.1)] rounded transition-all duration-200"
              title="Copiar URL"
            >
              {copiado ? (
                <Check className="w-4 h-4 text-[#00ff88]" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 hover:text-[#00ff88]" />
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-[rgba(45,45,65,0.8)]">
        <Link
          href={`/scripts/${id}`}
          className="flex items-center gap-1.5 text-sm text-[#00d4ff] hover:text-[#00ff88] transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          Editar
        </Link>
        
        {urlPublica && (
          <a
            href={urlPublica}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#00d4ff] transition-colors"
          >
            <Eye className="w-4 h-4" />
            Ver Script
          </a>
        )}
        
        <button
          onClick={() => setModalConfirmacionAbierto(true)}
          disabled={eliminando}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors ml-auto disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        abierto={modalConfirmacionAbierto}
        alCerrar={() => setModalConfirmacionAbierto(false)}
        alConfirmar={manejarEliminar}
        titulo="¿Eliminar script?"
        mensaje={`¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`}
        textoBotonConfirmar="Eliminar"
        textoBotonCancelar="Cancelar"
        tipo="peligro"
      />
    </div>
  );
}
