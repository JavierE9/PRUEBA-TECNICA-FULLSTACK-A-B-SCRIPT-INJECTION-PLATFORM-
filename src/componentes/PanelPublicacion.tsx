'use client';

import { useState } from 'react';
import { obtenerUrlScriptPublico, obtenerScriptTag, copiarAlPortapapeles } from '@/lib/utilidades';
import { Copy, Check, ExternalLink, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface PropsPanelPublicacion {
  idPublico: string;
}

/**
 * Panel que muestra la información de publicación de un script
 * Incluye URL pública y código para incrustar
 */
export default function PanelPublicacion({ idPublico }: PropsPanelPublicacion) {
  const [copiadoUrl, setCopiadoUrl] = useState(false);
  const [copiadoTag, setCopiadoTag] = useState(false);

  const urlPublica = obtenerUrlScriptPublico(idPublico);
  const scriptTag = obtenerScriptTag(idPublico);

  const manejarCopiarUrl = async () => {
    const exito = await copiarAlPortapapeles(urlPublica);
    if (exito) {
      setCopiadoUrl(true);
      toast.success('URL copiada al portapapeles');
      setTimeout(() => setCopiadoUrl(false), 2000);
    }
  };

  const manejarCopiarTag = async () => {
    const exito = await copiarAlPortapapeles(scriptTag);
    if (exito) {
      setCopiadoTag(true);
      toast.success('Script tag copiado al portapapeles');
      setTimeout(() => setCopiadoTag(false), 2000);
    }
  };

  return (
    <div className="rounded-xl p-5 space-y-4" 
         style={{ 
           background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.05))', 
           border: '1px solid rgba(0, 255, 136, 0.3)',
           boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
         }}>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-[#00ff88] rounded-full animate-pulse" style={{ boxShadow: '0 0 10px #00ff88' }} />
        <Zap className="w-4 h-4 text-[#00ff88]" />
        <span className="font-bold text-[#00ff88]">Script Publicado y Activo</span>
      </div>

      {/* URL Pública */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          URL Pública
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-3 rounded-lg text-sm text-[#00ff88] truncate font-mono"
                style={{ background: 'rgba(22, 22, 35, 0.8)', border: '1px solid rgba(0, 255, 136, 0.2)' }}>
            {urlPublica}
          </code>
          <button
            onClick={manejarCopiarUrl}
            className="p-2.5 rounded-lg transition-all duration-200"
            style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
            title="Copiar URL"
          >
            {copiadoUrl ? (
              <Check className="w-5 h-5 text-[#00ff88]" />
            ) : (
              <Copy className="w-5 h-5 text-gray-400 hover:text-[#00ff88]" />
            )}
          </button>
          <a
            href={urlPublica}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-lg transition-all duration-200"
            style={{ background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.2)' }}
            title="Abrir en nueva pestaña"
          >
            <ExternalLink className="w-5 h-5 text-gray-400 hover:text-[#00d4ff]" />
          </a>
        </div>
      </div>

      {/* Script Tag */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Código para Incrustar
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-3 rounded-lg text-sm text-[#00d4ff] truncate font-mono"
                style={{ background: 'rgba(22, 22, 35, 0.8)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            {scriptTag}
          </code>
          <button
            onClick={manejarCopiarTag}
            className="p-2.5 rounded-lg transition-all duration-200"
            style={{ background: 'rgba(0, 212, 255, 0.1)', border: '1px solid rgba(0, 212, 255, 0.2)' }}
            title="Copiar script tag"
          >
            {copiadoTag ? (
              <Check className="w-5 h-5 text-[#00d4ff]" />
            ) : (
              <Copy className="w-5 h-5 text-gray-400 hover:text-[#00d4ff]" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-400">
        💡 Añade este script tag en el <code className="text-[#00ff88]">&lt;head&gt;</code> o al final del <code className="text-[#00ff88]">&lt;body&gt;</code> 
        de cualquier página web para ejecutar tu código.
      </p>
    </div>
  );
}
