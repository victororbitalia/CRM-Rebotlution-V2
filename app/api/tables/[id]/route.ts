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

    // Validar posición si se proporciona
    if (body.position !== undefined) {
      if (!body.position || typeof body.position.x !== 'number' || typeof body.position.y !== 'number') {
        return NextResponse.json(
          { success: false, error: 'La posición debe ser un objeto con coordenadas x, y numéricas' },
          { status: 400 }
        );
      }
    }

    // Validar tamaño si se proporciona
    if (body.size !== undefined) {
      if (!body.size || typeof body.size.width !== 'number' || typeof body.size.height !== 'number') {
        return NextResponse.json(
          { success: false, error: 'El tamaño debe ser un objeto con width y height numéricos' },
          { status: 400 }
        );
      }
    }

    // Validar forma si se proporciona
    if (body.shape !== undefined) {
      const validShapes = ['square', 'rectangle', 'circle'];
      if (!validShapes.includes(body.shape)) {
        return NextResponse.json(
          { success: false, error: 'La forma debe ser: square, rectangle o circle' },
          { status: 400 }
        );
      }
    }

    // Validar ubicación si se proporciona
    if (body.location !== undefined) {
      const validLocations = ['interior', 'terraza', 'exterior', 'privado'];
      if (!validLocations.includes(body.location)) {
        return NextResponse.json(
          { success: false, error: 'La ubicación debe ser: interior, terraza, exterior o privado' },
          { status: 400 }
        );
      }
    }

    // Validar zona si se proporciona
    if (body.zoneId !== undefined && body.zoneId !== null) {
      if (body.zoneId !== null) {
        const zoneExists = await prisma.zone.findUnique({ where: { id: body.zoneId } });
        if (!zoneExists) {
          return NextResponse.json(
            { success: false, error: 'La zona especificada no existe' },
            { status: 400 }
          );
        }
      }
    }

    const updated = await prisma.table.update({
      where: { id: params.id },
      data: {
        ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
        ...(body.position !== undefined && { position: body.position }),
        ...(body.size !== undefined && { size: body.size }),
        ...(body.shape !== undefined && { shape: body.shape }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.zoneId !== undefined && { zoneId: body.zoneId }),
      },
      include: {
        zone: {
          select: {
            id: true,
            name: true,
            type: true,
            color: true,
          }
        }
      }
    });
    return NextResponse.json({ success: true, data: updated, message: 'Mesa actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar mesa:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la mesa: ' + (error instanceof Error ? error.message : 'Error desconocido') },
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



