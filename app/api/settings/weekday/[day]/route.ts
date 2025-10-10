import { NextRequest, NextResponse } from 'next/server';
import { RestaurantSettings, DayRules } from '@/types/settings';
import { defaultSettings } from '@/lib/defaultSettings';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const SETTINGS_ID = 'settings-singleton';

// GET /api/settings/weekday/:day - Obtener configuración de un día específico
export async function GET(
  request: NextRequest,
  { params }: { params: { day: string } }
) {
  try {
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(params.day)) {
      return NextResponse.json(
        { success: false, error: 'Día inválido. Debe ser: monday, tuesday, wednesday, thursday, friday, saturday, sunday' },
        { status: 400 }
      );
    }

    // Obtener configuración desde la base de datos
    const existing = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const settings = (existing?.data as any) || defaultSettings;
    const dayRules = settings.weekdayRules?.[params.day];

    if (!dayRules) {
      return NextResponse.json(
        { success: false, error: 'Configuración no encontrada para este día' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dayRules,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la configuración del día' },
      { status: 500 }
    );
  }
}

// PUT /api/settings/weekday/:day - Actualizar configuración de un día
export async function PUT(
  request: NextRequest,
  { params }: { params: { day: string } }
) {
  try {
    const body = await request.json();
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(params.day)) {
      return NextResponse.json(
        { success: false, error: 'Día inválido' },
        { status: 400 }
      );
    }

    // Obtener configuración actual desde BD
    const existing = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const settings = (existing?.data as any) || defaultSettings;

    // Validaciones
    if (body.maxReservations !== undefined && body.maxReservations < 0) {
      return NextResponse.json(
        { success: false, error: 'El máximo de reservas no puede ser negativo' },
        { status: 400 }
      );
    }

    if (body.tablesAvailable !== undefined && body.tablesAvailable > settings.tables.totalTables) {
      return NextResponse.json(
        { success: false, error: 'Las mesas disponibles no pueden exceder el total de mesas' },
        { status: 400 }
      );
    }

    // Actualizar reglas del día
    if (!settings.weekdayRules) {
      settings.weekdayRules = {};
    }
    
    settings.weekdayRules[params.day] = {
      ...settings.weekdayRules[params.day],
      ...body,
      day: params.day as any,
    };

    // Guardar en base de datos
    const saved = await prisma.restaurantSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, data: settings as unknown as Prisma.InputJsonValue },
      update: { data: settings as unknown as Prisma.InputJsonValue },
    });

    const updatedDayRules = (saved.data as any).weekdayRules[params.day];

    return NextResponse.json({
      success: true,
      data: updatedDayRules,
      message: `Configuración de ${params.day} actualizada exitosamente`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración del día' },
      { status: 500 }
    );
  }
}



