import { NextResponse } from 'next/server';
import { servicioScripts } from '@/lib/servicioScripts';

/**
 * GET /api/scripts
 * Obtiene todos los scripts
 */
export async function GET() {
  const resultado = await servicioScripts.obtenerTodos();
  
  if (resultado.error) {
    return NextResponse.json(
      { datos: null, error: resultado.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ datos: resultado.datos, error: null });
}

/**
 * POST /api/scripts
 * Crea un nuevo script
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, codigo } = body;

    if (!nombre || !codigo) {
      return NextResponse.json(
        { datos: null, error: 'Nombre y código son obligatorios' },
        { status: 400 }
      );
    }

    const resultado = await servicioScripts.crear({
      nombre,
      descripcion: descripcion || null,
      codigo,
    });

    if (resultado.error) {
      return NextResponse.json(
        { datos: null, error: resultado.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { datos: resultado.datos, error: null },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { datos: null, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
