'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Download, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';

/**
 * Página pública para visualizar el código del script con estilo
 */
export default function PaginaVistaPublica() {
  const params = useParams();
  const id = params.id as string;
  const idLimpio = id?.replace('.js', '');
  
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const cargarCodigo = async () => {
      if (!idLimpio) {
        setError('ID de script no válido');
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        const respuesta = await fetch(`/p/${idLimpio}.js`);
        
        if (!respuesta.ok) {
          throw new Error('Script no encontrado');
        }
        
        const texto = await respuesta.text();
        setCodigo(texto);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el script');
      } finally {
        setCargando(false);
      }
    };

    cargarCodigo();
  }, [idLimpio]);

  const manejarCopiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert('Error al copiar al portapapeles');
    }
  };

  const manejarDescargar = () => {
    const blob = new Blob([codigo], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${idLimpio}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0f19 0%, #1a1a2e 100%)' }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-3 border-[#00ff88] border-t-transparent rounded-full animate-spin" 
               style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }} />
          <span className="text-gray-400 font-medium">Cargando script...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f0f19 0%, #1a1a2e 100%)' }}>
        <div className="max-w-md w-full tarjeta text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/10 border-2 border-red-500/30">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/scripts" className="btn-primario inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver a Scripts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0f0f19 0%, #1a1a2e 100%)' }}>
      {/* Header */}
      <header 
        className="border-b sticky top-0 z-10 backdrop-blur-lg"
        style={{ 
          borderColor: 'rgba(45, 45, 65, 0.5)',
          background: 'rgba(15, 15, 25, 0.9)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/scripts"
              className="text-gray-400 hover:text-[#00ff88] transition-colors"
              title="Volver a Scripts"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
              Vista de Script Público
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={manejarCopiar}
              className="btn-secundario flex items-center gap-2"
            >
              {copiado ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>
            
            <button
              onClick={manejarDescargar}
              className="btn-primario flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </button>
          </div>
        </div>
      </header>

      {/* Código */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div 
            className="rounded-xl overflow-hidden"
            style={{ 
              background: 'rgba(10, 10, 15, 0.95)',
              border: '1px solid rgba(0, 255, 136, 0.2)',
              boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
            }}
          >
            <pre className="p-6 overflow-x-auto">
              <code 
                className="text-[#00ff88] font-mono leading-relaxed"
                style={{ fontSize: '16px' }}
              >
                {codigo}
              </code>
            </pre>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="border-t py-4"
        style={{ borderColor: 'rgba(45, 45, 65, 0.5)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Líneas: <span className="text-[#00ff88] font-semibold">{codigo.split('\n').length}</span>
            {' • '}
            Caracteres: <span className="text-[#00ff88] font-semibold">{codigo.length}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
