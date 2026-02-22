'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

interface PropsModalConfirmacion {
  abierto: boolean;
  alCerrar: () => void;
  alConfirmar: () => void;
  titulo: string;
  mensaje: string;
  textoBotonConfirmar?: string;
  textoBotonCancelar?: string;
  tipo?: 'peligro' | 'advertencia' | 'info';
}

/**
 * Modal de confirmación grande y centrado
 */
export default function ModalConfirmacion({ 
  abierto, 
  alCerrar, 
  alConfirmar, 
  titulo, 
  mensaje,
  textoBotonConfirmar = 'Confirmar',
  textoBotonCancelar = 'Cancelar',
  tipo = 'advertencia'
}: PropsModalConfirmacion) {
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

  const colores = {
    peligro: {
      borde: 'rgba(239, 68, 68, 0.3)',
      icono: 'text-red-400',
      boton: 'bg-red-500 hover:bg-red-600 text-white',
      sombra: '0 0 60px rgba(239, 68, 68, 0.2), 0 0 120px rgba(239, 68, 68, 0.1)'
    },
    advertencia: {
      borde: 'rgba(251, 191, 36, 0.3)',
      icono: 'text-yellow-400',
      boton: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      sombra: '0 0 60px rgba(251, 191, 36, 0.2), 0 0 120px rgba(251, 191, 36, 0.1)'
    },
    info: {
      borde: 'rgba(0, 212, 255, 0.3)',
      icono: 'text-[#00d4ff]',
      boton: 'bg-[#00d4ff] hover:bg-[#00b8e6] text-black',
      sombra: '0 0 60px rgba(0, 212, 255, 0.2), 0 0 120px rgba(0, 212, 255, 0.1)'
    }
  };

  const estilos = colores[tipo];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={alCerrar}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ 
          background: 'linear-gradient(180deg, rgba(22, 22, 35, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%)',
          border: `2px solid ${estilos.borde}`,
          boxShadow: estilos.sombra
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con icono */}
        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${estilos.icono}`}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${estilos.borde}`
            }}
          >
            <AlertTriangle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3">
            {titulo}
          </h2>
          
          <p className="text-lg text-gray-300 leading-relaxed">
            {mensaje}
          </p>
        </div>

        {/* Footer con botones */}
        <div 
          className="px-8 py-6 border-t flex justify-center gap-4"
          style={{ borderColor: 'rgba(45, 45, 65, 0.8)' }}
        >
          <button
            onClick={alCerrar}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 transition-all min-w-[120px]"
          >
            {textoBotonCancelar}
          </button>
          <button
            onClick={() => {
              alConfirmar();
              alCerrar();
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all min-w-[120px] ${estilos.boton}`}
          >
            {textoBotonConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
