import { NextResponse } from 'next/server';
import { servicioScripts } from '@/lib/servicioScripts';

interface Params {
  params: { id: string };
}

/**
 * POST /api/scripts/[id]/publicar
 * Publica un script y genera un ID público único
 */
export async function POST(request: Request, { params }: Params) {
  const { id } = params;
  
  const resultado = await servicioScripts.publicar(id);
  
  if (resultado.error) {
    return NextResponse.json(
      { datos: null, error: resultado.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ datos: resultado.datos, error: null });
}
