import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { defaultSettings } from '@/lib/defaultSettings';

const SETTINGS_ID = 'settings-singleton';

function deepMerge(target: any, source: any) {
  if (typeof target !== 'object' || target === null) return source;
  if (typeof source !== 'object' || source === null) return source;
  const output: any = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

// GET /api/settings - Obtener configuración actual
export async function GET(request: NextRequest) {
  try {
    const existing = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    if (!existing) {
      const created = await prisma.restaurantSettings.create({
        data: { id: SETTINGS_ID, data: defaultSettings as unknown as Prisma.InputJsonValue },
      });
      return NextResponse.json({ success: true, data: created.data });
    }
    return NextResponse.json({ success: true, data: existing.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al obtener la configuración' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Actualizar configuración completa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas
    if (body.reservations) {
      if (body.reservations.maxAdvanceDays < 1 || body.reservations.maxAdvanceDays > 365) {
        return NextResponse.json(
          { success: false, error: 'Los días máximos de anticipación deben estar entre 1 y 365' },
          { status: 400 }
        );
      }

      if (body.reservations.maxGuestsPerReservation < 1 || body.reservations.maxGuestsPerReservation > 50) {
        return NextResponse.json(
          { success: false, error: 'El máximo de comensales debe estar entre 1 y 50' },
          { status: 400 }
        );
      }
    }

    if (body.tables) {
      if (body.tables.totalTables < 1) {
        return NextResponse.json(
          { success: false, error: 'Debe haber al menos 1 mesa' },
          { status: 400 }
        );
      }

      if (body.tables.reservedTablesAlways >= body.tables.totalTables) {
        return NextResponse.json(
          { success: false, error: 'Las mesas reservadas no pueden ser igual o mayor al total' },
          { status: 400 }
        );
      }
    }

    const existing = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const nextData = { ...(existing?.data as any || {}), ...body } as unknown as Prisma.InputJsonValue;
    const saved = await prisma.restaurantSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, data: nextData },
      update: { data: nextData },
    });
    return NextResponse.json({ success: true, data: saved.data, message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración' },
      { status: 500 }
    );
  }
}

// PATCH /api/settings - Actualizar configuración parcial
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await prisma.restaurantSettings.findUnique({ where: { id: SETTINGS_ID } });
    const base = (existing?.data as any) || defaultSettings;
    const merged = deepMerge(base, body) as unknown as Prisma.InputJsonValue;
    const saved = await prisma.restaurantSettings.upsert({
      where: { id: SETTINGS_ID },
      create: { id: SETTINGS_ID, data: merged },
      update: { data: merged },
    });
    return NextResponse.json({ success: true, data: saved.data, message: 'Configuración actualizada exitosamente' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la configuración' },
      { status: 500 }
    );
  }
}



