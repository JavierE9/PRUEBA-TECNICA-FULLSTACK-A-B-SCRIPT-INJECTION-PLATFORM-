import { NextResponse } from 'next/server';
import { servicioScripts } from '@/lib/servicioScripts';

interface Params {
  params: { id: string };
}

/**
 * GET /api/scripts/[id]
 * Obtiene un script por su ID
 */
export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  
  const resultado = await servicioScripts.obtenerPorId(id);
  
  if (resultado.error) {
    return NextResponse.json(
      { datos: null, error: resultado.error },
      { status: 404 }
    );
  }

  return NextResponse.json({ datos: resultado.datos, error: null });
}

/**
 * PUT /api/scripts/[id]
 * Actualiza un script existente
 */
export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  
  try {
    const body = await request.json();
    const { nombre, descripcion, codigo } = body;

    const resultado = await servicioScripts.actualizar(id, {
      nombre,
      descripcion,
      codigo,
    });

    if (resultado.error) {
      return NextResponse.json(
        { datos: null, error: resultado.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ datos: resultado.datos, error: null });
  } catch {
    return NextResponse.json(
      { datos: null, error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/scripts/[id]
 * Elimina un script
 */
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  
  const resultado = await servicioScripts.eliminar(id);
  
  if (resultado.error) {
    return NextResponse.json(
      { datos: null, error: resultado.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ datos: null, error: null });
}
