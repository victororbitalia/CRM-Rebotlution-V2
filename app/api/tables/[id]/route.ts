import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tables/:id - Obtener una mesa específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const table = await prisma.table.findUnique({ where: { id: params.id } });

    if (!table) {
      return NextResponse.json(
        { success: false, error: 'Mesa no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: table,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la mesa' },
      { status: 500 }
    );
  }
}

// PUT /api/tables/:id - Actualizar estado de mesa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const exists = await prisma.table.findUnique({ where: { id: params.id } });
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Mesa no encontrada' }, { status: 404 });
    }

    // Validar disponibilidad
    if (body.isAvailable !== undefined && typeof body.isAvailable !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'isAvailable debe ser true o false' },
        { status: 400 }
      );
    }

    const updated = await prisma.table.update({
      where: { id: params.id },
      data: {
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : undefined,
      },
    });
    return NextResponse.json({ success: true, data: updated, message: 'Mesa actualizada exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la mesa' },
      { status: 500 }
    );
  }
}

// DELETE /api/tables/:id - Eliminar mesa
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exists = await prisma.table.findUnique({ where: { id: params.id } });
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Mesa no encontrada' }, { status: 404 });
    }
    const deleted = await prisma.table.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: deleted, message: 'Mesa eliminada exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la mesa' },
      { status: 500 }
    );
  }
}



