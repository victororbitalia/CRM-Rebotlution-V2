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

    const data = await prisma.table.findMany({ where, orderBy: { number: 'asc' } });
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
    if (!body.number || !body.capacity || !body.location) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos: number, capacity, location' },
        { status: 400 }
      );
    }
    const created = await prisma.table.create({
      data: {
        number: body.number,
        capacity: body.capacity,
        location: body.location,
        isAvailable: body.isAvailable ?? true,
      },
    });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al crear la mesa' },
      { status: 500 }
    );
  }
}



