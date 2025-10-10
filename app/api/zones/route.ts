import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/zones - Obtener todas las zonas
export async function GET(request: NextRequest) {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { name: 'asc' },
      include: {
        tables: {
          orderBy: { number: 'asc' },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: zones,
      count: zones.length 
    });
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener zonas' },
      { status: 500 }
    );
  }
}

// POST /api/zones - Crear nueva zona
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, dimensions, position, color } = body;

    // Validaciones básicas
    if (!name || !type || !dimensions || !position) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: name, type, dimensions, position' },
        { status: 400 }
      );
    }

    // Validar que el tipo de zona sea válido
    const validTypes = ['interior', 'terraza', 'exterior', 'privado'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de zona inválido. Debe ser: interior, terraza, exterior o privado' },
        { status: 400 }
      );
    }
    
    // Validar que las dimensiones sean correctas
    if (!dimensions.width || !dimensions.height || dimensions.width < 100 || dimensions.height < 100) {
      return NextResponse.json(
        { success: false, error: 'Las dimensiones deben ser válidas (ancho y alto mayores a 100px)' },
        { status: 400 }
      );
    }
    
    // Validar que la posición sea correcta
    if (typeof position.x !== 'number' || typeof position.y !== 'number' || position.x < 0 || position.y < 0) {
      return NextResponse.json(
        { success: false, error: 'La posición debe ser válida (coordenadas x, y mayores o iguales a 0)' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe una zona con ese nombre
    const existingZone = await prisma.zone.findFirst({
      where: { name: name.trim() }
    });
    
    if (existingZone) {
      return NextResponse.json(
        { success: false, error: `Ya existe una zona con el nombre "${name}"` },
        { status: 409 }
      );
    }

    // Crear nueva zona
    const newZone = await prisma.zone.create({
      data: {
        name: name.trim(),
        type,
        dimensions,
        position,
        color: color || '#f3f4f6',
      },
    });

    return NextResponse.json({
      success: true,
      data: newZone,
      message: 'Zona creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear zona:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear zona: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    );
  }
}