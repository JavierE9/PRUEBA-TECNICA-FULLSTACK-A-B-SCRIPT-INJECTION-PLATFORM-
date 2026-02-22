'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

// Importación dinámica del editor para evitar SSR
const EditorCodigo = dynamic(() => import('@/componentes/EditorCodigo'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-600">Cargando editor...</span>
    </div>
  ),
});

const codigoEjemplo = `// Ejemplo: Cambiar el color de fondo de la página
document.body.style.backgroundColor = '#f0f9ff';

// Ejemplo: Añadir un banner de prueba A/B
const banner = document.createElement('div');
banner.innerHTML = '🧪 Estás viendo la variante A del experimento';
banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#3b82f6;color:white;padding:10px;text-align:center;z-index:9999;';
document.body.appendChild(banner);

console.log('Script A/B ejecutado correctamente');
`;

/**
 * Página para crear un nuevo script
 */
export default function PaginaNuevoScript() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState(codigoEjemplo);
  const [guardando, setGuardando] = useState(false);

  const manejarGuardar = async () => {
    if (!nombre.trim()) {
      toast.error('Por favor, introduce un nombre para el script');
      return;
    }

    if (!descripcion.trim()) {
      toast.error('Por favor, introduce una descripción para el script');
      return;
    }

    if (!codigo.trim()) {
      toast.error('Por favor, escribe algo de código');
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          codigo: codigo,
        }),
      });

      const datos = await respuesta.json();

      if (datos.error) {
        toast.error(datos.error);
      } else {
        toast.success('Script creado correctamente');
        router.push(`/scripts/${datos.datos.id}`);
      }
    } catch {
      toast.error('Error al crear el script');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-8">
        <Link
          href="/scripts"
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#00ff88] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Scripts
        </Link>
        <h1 className="text-4xl font-black bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">
          Crear Nuevo Script
        </h1>
        <p className="mt-2 text-gray-400">
          Escribe código JavaScript que será inyectado en páginas web
        </p>
      </div>

      {/* Formulario */}
      <div className="space-y-6 tarjeta">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-semibold text-gray-300 mb-2">
            Nombre del Script *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Banner promocional, Cambio de colores, Test CTA..."
            className="input"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-300 mb-2">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe qué hace este script..."
            rows={2}
            className="input"
            required
          />
        </div>

        {/* Editor de Código */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Código JavaScript *
          </label>
          <EditorCodigo
            valorInicial={codigo}
            alCambiar={setCodigo}
            altura="400px"
          />
        </div>

        {/* Botones */}
        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={manejarGuardar}
            disabled={guardando}
            className="btn-primario flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {guardando ? 'Guardando...' : 'Guardar como Borrador'}
          </button>
          <Link href="/scripts" className="btn-secundario">
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}
