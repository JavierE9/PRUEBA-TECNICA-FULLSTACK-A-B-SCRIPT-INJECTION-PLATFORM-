'use client';

import { Save, Send, Eye, EyeOff } from 'lucide-react';

interface PropsBotonesAccion {
  guardando: boolean;
  publicando: boolean;
  estaPublicado: boolean;
  tieneIdPublico: boolean;
  onGuardar: () => void;
  onPublicar: () => void;
  onDespublicar: () => void;
  onVerPublico: () => void;
}

/**
 * Botones de acción para guardar, publicar y ver script
 */
export default function BotonesAccion({
  guardando,
  publicando,
  estaPublicado,
  tieneIdPublico,
  onGuardar,
  onPublicar,
  onDespublicar,
  onVerPublico,
}: PropsBotonesAccion) {
  return (
    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[rgba(45,45,65,0.8)]">
      <button
        onClick={onGuardar}
        disabled={guardando}
        className="btn-secundario flex items-center gap-2"
      >
        <Save className="w-5 h-5" />
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>

      {estaPublicado ? (
        <button
          onClick={onDespublicar}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
        >
          <EyeOff className="w-5 h-5" />
          Despublicar
        </button>
      ) : (
        <button
          onClick={onPublicar}
          disabled={publicando}
          className="btn-primario flex items-center gap-2"
        >
          <Send className="w-5 h-5" />
          {publicando ? 'Publicando...' : 'Publicar'}
        </button>
      )}

      {estaPublicado && tieneIdPublico && (
        <button
          onClick={onVerPublico}
          className="flex items-center gap-2 text-gray-400 hover:text-[#00d4ff] transition-colors"
        >
          <Eye className="w-5 h-5" />
          Ver Script Público
        </button>
      )}
    </div>
  );
}
