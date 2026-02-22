import { customAlphabet } from 'nanoid';

/**
 * Funciones de utilidad para la Plataforma de Inyección de Scripts A/B
 */


const alfabeto = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';
export const generarIdPublico = customAlphabet(alfabeto, 10);

/**
 * Formatea una fecha para mostrar
 */
export function formatearFecha(fechaString: string): string {
  const fecha = new Date(fechaString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(fecha);
}

/**
 * Formatea tiempo relativo (ej: "hace 2 horas")
 */
export function formatearTiempoRelativo(fechaString: string): string {
  const fecha = new Date(fechaString);
  const ahora = new Date();
  const diffEnSegundos = Math.floor((ahora.getTime() - fecha.getTime()) / 1000);

  if (diffEnSegundos < 60) {
    return 'ahora mismo';
  }

  const diffEnMinutos = Math.floor(diffEnSegundos / 60);
  if (diffEnMinutos < 60) {
    return `hace ${diffEnMinutos} minuto${diffEnMinutos > 1 ? 's' : ''}`;
  }

  const diffEnHoras = Math.floor(diffEnMinutos / 60);
  if (diffEnHoras < 24) {
    return `hace ${diffEnHoras} hora${diffEnHoras > 1 ? 's' : ''}`;
  }

  const diffEnDias = Math.floor(diffEnHoras / 24);
  if (diffEnDias < 7) {
    return `hace ${diffEnDias} día${diffEnDias > 1 ? 's' : ''}`;
  }

  return formatearFecha(fechaString);
}

/**
 * Genera la URL pública para un script
 */
export function obtenerUrlScriptPublico(idPublico: string): string {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${urlBase}/p/${idPublico}.js`;
}

/**
 * Genera el script tag para incrustar
 */
export function obtenerScriptTag(idPublico: string): string {
  const url = obtenerUrlScriptPublico(idPublico);
  return `<script src="${url}"></script>`;
}

/**
 * Valida sintaxis de código JavaScript (validación básica)
 */
export function validarJavaScript(codigo: string): { valido: boolean; error?: string } {
  try {
    // Usamos el constructor Function para validar sintaxis sin ejecutar
    new Function(codigo);
    return { valido: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { valido: false, error: error.message };
    }
    return { valido: false, error: 'Error de validación desconocido' };
  }
}

/**
 * Envuelve el código del usuario en un IIFE para prevenir contaminación del scope global
 */
export function envolverEnIIFE(codigo: string): string {
  return `(function() {
  'use strict';
  try {
${codigo.split('\n').map(linea => '    ' + linea).join('\n')}
  } catch (e) {
    console.error('[AB Script Injection] Error:', e);
  }
})();`;
}

/**
 * Trunca texto con puntos suspensivos
 */
export function truncar(texto: string, longitudMaxima: number): string {
  if (texto.length <= longitudMaxima) return texto;
  return texto.slice(0, longitudMaxima - 3) + '...';
}

/**
 * Copia texto al portapapeles
 */
export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const exito = document.execCommand('copy');
    document.body.removeChild(textarea);
    return exito;
  }
}
