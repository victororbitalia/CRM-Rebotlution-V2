import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/stats - Obtener estadísticas del dashboard
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    const today = date ? new Date(date) : new Date();
    today.setHours(0, 0, 0, 0);

    // Reservas de hoy (desde BD)
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const todayReservations = await prisma.reservation.findMany({
      where: { date: { gte: startOfDay, lt: endOfDay } },
      select: { id: true, guests: true, status: true, date: true },
    });

    // Semana
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekReservations = await prisma.reservation.count({
      where: { date: { gte: weekStart, lt: weekEnd } },
    });

    const totalGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);
    const averageGuests = todayReservations.length > 0 ? parseFloat((totalGuests / todayReservations.length).toFixed(1)) : 0;

    const tables = await prisma.table.findMany({ select: { id: true, isAvailable: true, capacity: true } });
    const occupiedTables = tables.filter(t => !t.isAvailable).length;
    const occupancyRate = Math.round((occupiedTables / (tables.length || 1)) * 100);

    const statusBreakdown = {
      pending: todayReservations.filter(r => r.status === 'pending').length,
      confirmed: todayReservations.filter(r => r.status === 'confirmed').length,
      seated: todayReservations.filter(r => r.status === 'seated').length,
      completed: todayReservations.filter(r => r.status === 'completed').length,
      cancelled: todayReservations.filter(r => r.status === 'cancelled').length,
    };

    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const availableCapacity = tables.filter(t => t.isAvailable).reduce((sum, t) => sum + t.capacity, 0);

    return NextResponse.json({
      success: true,
      data: {
        date: today.toISOString().split('T')[0],
        reservations: { today: todayReservations.length, week: weekReservations, statusBreakdown },
        guests: { average: averageGuests, total: totalGuests },
        tables: {
          total: tables.length,
          available: tables.filter(t => t.isAvailable).length,
          occupied: occupiedTables,
          occupancyRate: occupancyRate,
        },
        capacity: {
          total: totalCapacity,
          available: availableCapacity,
          occupied: totalCapacity - availableCapacity,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}


