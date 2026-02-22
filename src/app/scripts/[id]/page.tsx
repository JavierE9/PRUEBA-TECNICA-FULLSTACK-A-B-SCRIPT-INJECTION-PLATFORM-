'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PanelPublicacion from '@/componentes/PanelPublicacion';
import EncabezadoScript from '@/componentes/EncabezadoScript';
import FormularioScript from '@/componentes/FormularioScript';
import BotonesAccion from '@/componentes/BotonesAccion';
import { useScript } from '@/lib/hooks/useScript';

/**
 * Página de edición de script
 */
export default function PaginaEditarScript() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    script,
    nombre,
    descripcion,
    codigo,
    cargando,
    guardando,
    publicando,
    setNombre,
    setDescripcion,
    setCodigo,
    cargarScript,
    guardarScript,
    publicarScript,
    despublicarScript,
  } = useScript(id);

  useEffect(() => {
    if (id) {
      cargarScript();
    }
  }, [id, cargarScript]);

  const manejarVerPublico = () => {
    if (script?.id_publico) {
      router.push(`/p/${script.id_publico}`);
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
      <EncabezadoScript estaPublicado={estaPublicado} />

      {estaPublicado && script.id_publico && (
        <div className="mb-6">
          <PanelPublicacion idPublico={script.id_publico} />
        </div>
      )}

      <FormularioScript
        nombre={nombre}
        descripcion={descripcion}
        codigo={codigo}
        onNombreCambiar={setNombre}
        onDescripcionCambiar={setDescripcion}
        onCodigoCambiar={setCodigo}
      />

      <div className="mt-6">
        <BotonesAccion
          guardando={guardando}
          publicando={publicando}
          estaPublicado={estaPublicado}
          tieneIdPublico={!!script.id_publico}
          onGuardar={guardarScript}
          onPublicar={publicarScript}
          onDespublicar={despublicarScript}
          onVerPublico={manejarVerPublico}
        />
      </div>
    </div>
  );
}
