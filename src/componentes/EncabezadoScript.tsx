'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PropsEncabezadoScript {
  estaPublicado: boolean;
}

/**
 * Encabezado de la página de edición de script
 */
export default function EncabezadoScript({ estaPublicado }: PropsEncabezadoScript) {
  return (
    <div className="mb-8">
      <Link
        href="/scripts"
        className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#00ff88] transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Mis Scripts
      </Link>
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-black bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
          Editar Script
        </h1>
        <span className={estaPublicado ? 'badge-publicado' : 'badge-borrador'}>
          {estaPublicado ? 'Publicado' : 'Borrador'}
        </span>
      </div>
    </div>
  );
}
