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

    // Crear nueva zona
    const newZone = await prisma.zone.create({
      data: {
        name,
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
      { success: false, error: 'Error al crear zona' },
      { status: 500 }
    );
  }
}