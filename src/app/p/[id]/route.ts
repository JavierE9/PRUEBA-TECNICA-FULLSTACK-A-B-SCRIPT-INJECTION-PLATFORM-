import { NextResponse } from 'next/server';
import { servicioScripts } from '@/lib/servicioScripts';
import { envolverEnIIFE } from '@/lib/utilidades';

interface Params {
  params: { id: string };
}

/**
 * GET /p/[id].js
 * Endpoint público que devuelve el código JavaScript del script
 * Este endpoint es accesible sin autenticación y puede ser inyectado en cualquier página
 */
export async function GET(request: Request, { params }: Params) {
  const idConExtension = params.id;
  const idPublico = idConExtension.replace(/\.js$/, '');
  
  const resultado = await servicioScripts.obtenerPorIdPublico(idPublico);
  
  if (resultado.error || !resultado.datos) {

    const scriptError = `// Script no encontrado o no publicado
console.warn('[AB Script Injection] Script con ID "${idPublico}" no encontrado o no está publicado.');
`;
    return new NextResponse(scriptError, {
      status: 404,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-cache',
      },
    });
  }

  // Envolver el código en un IIFE para ejecución segura
  const codigoEnvuelto = envolverEnIIFE(resultado.datos.codigo);
  

  const scriptFinal = `/**
 * AB Script Injection Platform
 * Script ID: ${idPublico}
 * Generado: ${new Date().toISOString()}
 */
${codigoEnvuelto}
`;

  return new NextResponse(scriptFinal, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  });
}
