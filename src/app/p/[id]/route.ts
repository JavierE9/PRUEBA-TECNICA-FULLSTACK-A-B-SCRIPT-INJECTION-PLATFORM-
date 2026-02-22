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
  // Limpiar el ID removiendo .js si existe (por si se accede directamente sin rewrite)
  const idPublico = idConExtension.replace(/\.js$/, '');
  
  console.log('[Route /p/[id]] ID recibido:', idConExtension, '-> ID limpio:', idPublico);
  
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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

// Forzar que esta ruta sea dinámica (sin caché de Next.js)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
