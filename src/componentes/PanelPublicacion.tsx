'use client';

import { useState } from 'react';
import { obtenerUrlScriptPublico, obtenerScriptTag, copiarAlPortapapeles } from '@/lib/utilidades';
import { Copy, Check, ExternalLink } from 'lucide-react';
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
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <span className="font-medium text-green-800">Script Publicado</span>
      </div>

      {/* URL Pública */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Pública
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-gray-800 truncate">
            {urlPublica}
          </code>
          <button
            onClick={manejarCopiarUrl}
            className="p-2 hover:bg-green-100 rounded transition-colors"
            title="Copiar URL"
          >
            {copiadoUrl ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <a
            href={urlPublica}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-green-100 rounded transition-colors"
            title="Abrir en nueva pestaña"
          >
            <ExternalLink className="w-5 h-5 text-gray-600" />
          </a>
        </div>
      </div>

      {/* Script Tag */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Código para Incrustar
        </label>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-2 bg-white border border-gray-300 rounded text-sm text-gray-800 truncate">
            {scriptTag}
          </code>
          <button
            onClick={manejarCopiarTag}
            className="p-2 hover:bg-green-100 rounded transition-colors"
            title="Copiar script tag"
          >
            {copiadoTag ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-green-700">
        💡 Añade este script tag en el <code>&lt;head&gt;</code> o al final del <code>&lt;body&gt;</code> 
        de cualquier página web para ejecutar tu código.
      </p>
    </div>
  );
}
