import { NextRequest, NextResponse } from 'next/server';
import { ReservationStatus } from '@/types';
import { prisma } from '@/lib/prisma';

// PATCH /api/reservations/:id/status - Cambiar estado de reserva
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const exists = await prisma.reservation.findUnique({ where: { id: params.id }, select: { id: true } });
    if (!exists) {
      return NextResponse.json({ success: false, error: 'Reserva no encontrada' }, { status: 404 });
    }

    // Validar estado
    const validStatuses: ReservationStatus[] = ['pending', 'confirmed', 'seated', 'completed', 'cancelled'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Estado inválido. Debe ser: pending, confirmed, seated, completed o cancelled' 
        },
        { status: 400 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id: params.id },
      data: { status: body.status },
      select: { id: true, status: true },
    });

    return NextResponse.json({ success: true, data: updated, message: `Estado actualizado a: ${body.status}` });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el estado' },
      { status: 500 }
    );
  }
}



