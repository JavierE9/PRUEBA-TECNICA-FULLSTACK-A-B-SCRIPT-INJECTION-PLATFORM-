'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Save, Send, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import PanelPublicacion from '@/componentes/PanelPublicacion';
import type { Script } from '@/tipos/basedatos';

// Importación dinámica del editor
const EditorCodigo = dynamic(() => import('@/componentes/EditorCodigo'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-600">Cargando editor...</span>
    </div>
  ),
});

/**
 * Página de edición de script
 */
export default function PaginaEditarScript() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [script, setScript] = useState<Script | null>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [publicando, setPublicando] = useState(false);

  const cargarScript = useCallback(async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(`/api/scripts/${id}`);
      const datos = await respuesta.json();

      if (datos.error) {
        toast.error(datos.error);
        router.push('/scripts');
      } else {
        setScript(datos.datos);
        setNombre(datos.datos.nombre);
        setDescripcion(datos.datos.descripcion || '');
        setCodigo(datos.datos.codigo);
      }
    } catch {
      toast.error('Error al cargar el script');
      router.push('/scripts');
    } finally {
      setCargando(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (id) {
      cargarScript();
    }
  }, [id, cargarScript]);

  const manejarGuardar = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    setGuardando(true);
    try {
      const respuesta = await fetch(`/api/scripts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          codigo,
        }),
      });

      const datos = await respuesta.json();

      if (datos.error) {
        toast.error(datos.error);
      } else {
        setScript(datos.datos);
        toast.success('Script guardado correctamente');
      }
    } catch {
      toast.error('Error al guardar el script');
    } finally {
      setGuardando(false);
    }
  };

  const manejarPublicar = async () => {
    setPublicando(true);
    try {
      // Primero guardamos los cambios
      await manejarGuardar();

      const respuesta = await fetch(`/api/scripts/${id}/publicar`, {
        method: 'POST',
      });

      const datos = await respuesta.json();

      if (datos.error) {
        toast.error(datos.error);
      } else {
        setScript(datos.datos);
        toast.success('¡Script publicado! Ya está disponible públicamente.');
      }
    } catch {
      toast.error('Error al publicar el script');
    } finally {
      setPublicando(false);
    }
  };

  const manejarDespublicar = async () => {
    try {
      const respuesta = await fetch(`/api/scripts/${id}/despublicar`, {
        method: 'POST',
      });

      const datos = await respuesta.json();

      if (datos.error) {
        toast.error(datos.error);
      } else {
        setScript(datos.datos);
        toast.success('Script despublicado. Ahora es un borrador.');
      }
    } catch {
      toast.error('Error al despublicar el script');
    }
  };

  if (cargando) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Cargando script...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!script) {
    return null;
  }

  const estaPublicado = script.estado === 'publicado';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Encabezado */}
      <div className="mb-8">
        <Link
          href="/scripts"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Scripts
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">Editar Script</h1>
          <span className={estaPublicado ? 'badge-publicado' : 'badge-borrador'}>
            {estaPublicado ? 'Publicado' : 'Borrador'}
          </span>
        </div>
      </div>

      {/* Panel de publicación */}
      {estaPublicado && script.id_publico && (
        <div className="mb-6">
          <PanelPublicacion idPublico={script.id_publico} />
        </div>
      )}

      {/* Formulario */}
      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Script *
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción (opcional)
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            className="input"
          />
        </div>

        {/* Editor de Código */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Código JavaScript *
          </label>
          <EditorCodigo
            valorInicial={codigo}
            alCambiar={setCodigo}
            altura="400px"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={manejarGuardar}
            disabled={guardando}
            className="btn-secundario flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>

          {estaPublicado ? (
            <button
              onClick={manejarDespublicar}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium"
            >
              <EyeOff className="w-5 h-5" />
              Despublicar
            </button>
          ) : (
            <button
              onClick={manejarPublicar}
              disabled={publicando}
              className="btn-primario flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {publicando ? 'Publicando...' : 'Publicar'}
            </button>
          )}

          {estaPublicado && script.id_publico && (
            <a
              href={`/p/${script.id_publico}.js`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Eye className="w-5 h-5" />
              Ver Script Público
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
