import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tables - Listar todas las mesas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const available = searchParams.get('available');
    const minCapacity = searchParams.get('minCapacity');

    const where: any = {};
    if (location) where.location = location;
    if (available !== null) where.isAvailable = available === 'true';
    if (minCapacity) where.capacity = { gte: parseInt(minCapacity) };

    const data = await prisma.table.findMany({
      where,
      orderBy: { number: 'asc' },
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
    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener mesas' },
      { status: 500 }
    );
  }
}

// POST /api/tables - Crear una mesa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validaciones mejoradas
    if (!body.number || !body.capacity || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos: number, capacity, location' },
        { status: 400 }
      );
    }
    
    // Validar tipos de datos
    if (typeof body.number !== 'number' || isNaN(body.number)) {
      return NextResponse.json(
        { success: false, error: 'El número de mesa debe ser un valor numérico válido' },
        { status: 400 }
      );
    }
    
    if (typeof body.capacity !== 'number' || isNaN(body.capacity) || body.capacity < 1) {
      return NextResponse.json(
        { success: false, error: 'La capacidad debe ser un número mayor a 0' },
        { status: 400 }
      );
    }
    
    const validLocations = ['interior', 'terraza', 'exterior', 'privado'];
    if (!validLocations.includes(body.location)) {
      return NextResponse.json(
        { success: false, error: 'Ubicación inválida. Debe ser: interior, terraza, exterior o privado' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe una mesa con ese número
    const existingTable = await prisma.table.findFirst({
      where: { number: body.number }
    });
    
    if (existingTable) {
      return NextResponse.json(
        { success: false, error: `Ya existe una mesa con el número ${body.number}` },
        { status: 409 }
      );
    }
    
    const created = await prisma.table.create({
      data: {
        number: body.number,
        capacity: body.capacity,
        location: body.location,
        isAvailable: body.isAvailable ?? true,
        position: body.position || { x: 0, y: 0 },
        size: body.size || { width: 60, height: 60 },
        shape: body.shape || 'square',
        status: 'available',
        zoneId: body.zoneId,
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
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error al crear mesa:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la mesa: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    );
  }
}



