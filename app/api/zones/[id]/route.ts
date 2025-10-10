import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/zones/[id] - Obtener una zona específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const zone = await prisma.zone.findUnique({
      where: { id: params.id },
      include: {
        tables: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!zone) {
      return NextResponse.json(
        { success: false, error: 'Zona no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: zone 
    });
  } catch (error) {
    console.error('Error al obtener zona:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener zona' },
      { status: 500 }
    );
  }
}

// PUT /api/zones/[id] - Actualizar una zona
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, type, dimensions, position, color } = body;

    // Validar que la zona exista
    const existingZone = await prisma.zone.findUnique({
      where: { id: params.id },
    });

    if (!existingZone) {
      return NextResponse.json(
        { success: false, error: 'Zona no encontrada' },
        { status: 404 }
      );
    }

    // Validar que el tipo de zona sea válido si se proporciona
    if (type) {
      const validTypes = ['interior', 'terraza', 'exterior', 'privado'];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { success: false, error: 'Tipo de zona inválido. Debe ser: interior, terraza, exterior o privado' },
          { status: 400 }
        );
      }
    }

    // Actualizar zona
    const updatedZone = await prisma.zone.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(dimensions && { dimensions }),
        ...(position && { position }),
        ...(color !== undefined && { color }),
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedZone,
      message: 'Zona actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar zona:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar zona' },
      { status: 500 }
    );
  }
}

// DELETE /api/zones/[id] - Eliminar una zona
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validar que la zona exista
    const existingZone = await prisma.zone.findUnique({
      where: { id: params.id },
    });

    if (!existingZone) {
      return NextResponse.json(
        { success: false, error: 'Zona no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si hay mesas asociadas a esta zona
    const tablesInZone = await prisma.table.count({
      where: { zoneId: params.id },
    });

    if (tablesInZone > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `No se puede eliminar la zona porque tiene ${tablesInZone} mesas asociadas. Primero elimina o reasigna las mesas.` 
        },
        { status: 400 }
      );
    }

    // Eliminar zona
    await prisma.zone.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Zona eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar zona:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar zona' },
      { status: 500 }
    );
  }
}