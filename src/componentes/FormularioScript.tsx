'use client';

import dynamic from 'next/dynamic';

const EditorCodigo = dynamic(() => import('@/componentes/EditorCodigo'), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg flex items-center justify-center" style={{ background: 'rgba(22, 22, 35, 0.8)' }}>
      <span className="text-gray-400">Cargando editor...</span>
    </div>
  ),
});

interface PropsFormularioScript {
  nombre: string;
  descripcion: string;
  codigo: string;
  onNombreCambiar: (valor: string) => void;
  onDescripcionCambiar: (valor: string) => void;
  onCodigoCambiar: (valor: string) => void;
}

/**
 * Formulario de edición de script
 */
export default function FormularioScript({
  nombre,
  descripcion,
  codigo,
  onNombreCambiar,
  onDescripcionCambiar,
  onCodigoCambiar,
}: PropsFormularioScript) {
  return (
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
          onChange={(e) => onNombreCambiar(e.target.value)}
          className="input"
          placeholder="Ej: Formulario de contacto mejorado"
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
          onChange={(e) => onDescripcionCambiar(e.target.value)}
          rows={2}
          className="input"
          placeholder="Describe brevemente qué hace este script..."
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
          alCambiar={onCodigoCambiar}
          altura="400px"
        />
      </div>
    </div>
  );
}
