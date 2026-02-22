'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface PropsModalCodigo {
  abierto: boolean;
  alCerrar: () => void;
  codigo: string;
  titulo: string;
}

/**
 * Modal para mostrar código con sintaxis resaltada
 */
export default function ModalCodigo({ abierto, alCerrar, codigo, titulo }: PropsModalCodigo) {
  useEffect(() => {
    const manejarEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') alCerrar();
    };

    if (abierto) {
      document.addEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', manejarEscape);
      document.body.style.overflow = 'unset';
    };
  }, [abierto, alCerrar]);

  if (!abierto) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={alCerrar}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />
      
      {/* Modal - Pantalla completa */}
      <div 
        className="relative w-full h-full flex flex-col overflow-hidden"
        style={{ 
          background: 'linear-gradient(180deg, rgba(22, 22, 35, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%)',
          border: 'none',
          boxShadow: 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0"
          style={{ 
            borderColor: 'rgba(45, 45, 65, 0.8)',
            background: 'rgba(15, 15, 25, 0.95)'
          }}
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
            {titulo}
          </h2>
          <button
            onClick={alCerrar}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-all"
            title="Cerrar (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Código - Pantalla completa SIN padding ni márgenes */}
        <div className="flex-1 overflow-auto">
          <pre 
            className="h-full m-0 p-6"
            style={{ 
              background: 'rgba(10, 10, 15, 0.95)',
              fontSize: '18px',
              lineHeight: '1.8'
            }}
          >
            <code className="text-[#00ff88] font-mono whitespace-pre">
              {codigo}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t flex justify-end gap-3 flex-shrink-0"
          style={{ 
            borderColor: 'rgba(45, 45, 65, 0.8)',
            background: 'rgba(15, 15, 25, 0.95)'
          }}
        >
          <button
            onClick={alCerrar}
            className="btn-primario"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
