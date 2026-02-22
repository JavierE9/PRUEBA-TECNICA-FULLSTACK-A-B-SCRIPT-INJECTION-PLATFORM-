import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropsPaginacion {
  paginaActual: number;
  totalPaginas: number;
  alCambiarPagina: (pagina: number) => void;
}

/**
 * Componente de Paginación - Navegación entre páginas de resultados
 */
export default function Paginacion({ paginaActual, totalPaginas, alCambiarPagina }: PropsPaginacion) {
  if (totalPaginas <= 1) return null;

  const generarNumerosPagina = () => {
    const paginas: (number | string)[] = [];
    const rango = 2; 

  
    paginas.push(1);


    let inicio = Math.max(2, paginaActual - rango);
    let fin = Math.min(totalPaginas - 1, paginaActual + rango);


    if (paginaActual <= rango + 2) {
      fin = Math.min(totalPaginas - 1, rango * 2 + 2);
    }
    if (paginaActual >= totalPaginas - rango - 1) {
      inicio = Math.max(2, totalPaginas - rango * 2 - 1);
    }


    if (inicio > 2) {
      paginas.push('...');
    }


    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    if (fin < totalPaginas - 1) {
      paginas.push('...');
    }


    if (totalPaginas > 1) {
      paginas.push(totalPaginas);
    }

    return paginas;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Botón Anterior */}
      <button
        onClick={() => alCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium
                   transition-all duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed
                   bg-gray-800/50 border border-gray-700/50
                   hover:bg-gray-700/50 hover:border-[#00ff88]/30
                   text-gray-300 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Números de Página */}
      <div className="flex items-center gap-1.5">
        {generarNumerosPagina().map((pagina, index) => {
          if (pagina === '...') {
            return (
              <span key={`dots-${index}`} className="px-2 text-gray-500">
                •••
              </span>
            );
          }

          const esPaginaActual = pagina === paginaActual;

          return (
            <button
              key={pagina}
              onClick={() => alCambiarPagina(pagina as number)}
              className={`
                min-w-[40px] h-[40px] rounded-lg font-semibold
                transition-all duration-200
                ${
                  esPaginaActual
                    ? 'bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-gray-900 shadow-lg shadow-[#00ff88]/20'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:border-[#00ff88]/30 hover:text-white'
                }
              `}
            >
              {pagina}
            </button>
          );
        })}
      </div>

      {/* Botón Siguiente */}
      <button
        onClick={() => alCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium
                   transition-all duration-200
                   disabled:opacity-40 disabled:cursor-not-allowed
                   bg-gray-800/50 border border-gray-700/50
                   hover:bg-gray-700/50 hover:border-[#00ff88]/30
                   text-gray-300 hover:text-white"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
