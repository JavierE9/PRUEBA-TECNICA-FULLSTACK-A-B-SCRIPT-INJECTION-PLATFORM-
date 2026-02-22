'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';

interface PropsEditorCodigo {
  valorInicial?: string;
  alCambiar?: (valor: string) => void;
  soloLectura?: boolean;
  altura?: string;
}

/**
 * Componente Editor de Código - Usa Monaco Editor (el mismo de VS Code)
 * Proporciona resaltado de sintaxis, autocompletado y detección de errores
 */
export default function EditorCodigo({
  valorInicial = '// Escribe tu código JavaScript aquí\n',
  alCambiar,
  soloLectura = false,
  altura = '400px',
}: PropsEditorCodigo) {
  const [cargando, setCargando] = useState(true);

  const manejarCambioEditor = (valor: string | undefined) => {
    if (valor !== undefined && alCambiar) {
      alCambiar(valor);
    }
  };

  const manejarMontaje = () => {
    setCargando(false);
  };

  return (
    <div className="relative">
      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Cargando editor...</span>
          </div>
        </div>
      )}
      <div className="contenedor-editor-monaco rounded-lg overflow-hidden border border-gray-300">
        <Editor
          height={altura}
          defaultLanguage="javascript"
          defaultValue={valorInicial}
          onChange={manejarCambioEditor}
          onMount={manejarMontaje}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: soloLectura,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
          }}
          theme="vs-light"
        />
      </div>
    </div>
  );
}
