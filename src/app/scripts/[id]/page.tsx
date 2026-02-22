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
    <div className="h-96 rounded-lg flex items-center justify-center" style={{ background: 'rgba(22, 22, 35, 0.8)' }}>
      <span className="text-gray-400">Cargando editor...</span>
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
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-3 border-[#00ff88] border-t-transparent rounded-full animate-spin" 
                 style={{ boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' }} />
            <span className="text-gray-400 font-medium">Cargando script...</span>
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
          className="inline-flex items-center gap-1.5 text-gray-400 hover:text-[#00ff88] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Mis Scripts
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black bg-gradient-to-r from-[#00ff88] to-[#00d4ff] bg-clip-text text-transparent">Editar Script</h1>
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
            className="input"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-300 mb-2">
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
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[rgba(45,45,65,0.8)]">
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
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
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
              className="flex items-center gap-2 text-gray-400 hover:text-[#00d4ff] transition-colors"
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
