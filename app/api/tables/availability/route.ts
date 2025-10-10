import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tables/availability - Verificar disponibilidad de mesas
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const guests = searchParams.get('guests');
    const location = searchParams.get('location');

    if (!date || !time || !guests) {
      return NextResponse.json(
        { success: false, error: 'Se requieren los parámetros: date, time, guests' },
        { status: 400 }
      );
    }

    const guestsNum = parseInt(guests);
    if (isNaN(guestsNum) || guestsNum < 1) {
      return NextResponse.json(
        { success: false, error: 'El número de comensales debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Construir filtro para Prisma
    const where: any = {
      isAvailable: true,
      capacity: { gte: guestsNum },
    };

    // Filtrar por ubicación si se especifica
    if (location) {
      where.location = location;
    }

    // Obtener mesas disponibles desde la base de datos
    const availableTables = await prisma.table.findMany({
      where,
      orderBy: { capacity: 'asc' }, // Las más pequeñas primero para optimizar
    });

    return NextResponse.json({
      success: true,
      data: {
        available: availableTables.length > 0,
        tables: availableTables,
        count: availableTables.length,
        requestedFor: {
          date,
          time,
          guests: guestsNum,
          location: location || 'any',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al verificar disponibilidad' },
      { status: 500 }
    );
  }
}



