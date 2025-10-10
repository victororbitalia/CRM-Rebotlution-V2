import { DateTime } from 'luxon';
import { Reservation } from '@/types';

type GroupedReservations = {
  key: string; // day key
  reservations: Reservation[];
};

export function classifyAndGroupReservations(
  reservations: Reservation[],
  timezone: string = 'Europe/Madrid',
  now?: Date
) {
  const reference = now ? DateTime.fromJSDate(now).setZone(timezone) : DateTime.now().setZone(timezone);

  const upcoming: Reservation[] = [];
  const past: Reservation[] = [];

  for (const r of reservations) {
    if (!r.time) {
      past.push(r);
      continue;
    }
    // Extraer componentes de fecha de forma estable (usar UTC para no desplazar día)
    const base = DateTime.fromJSDate(new Date(r.date)).setZone(timezone);
    const year = base.year;
    const month = base.month;
    const day = base.day;
    const [hourStr, minuteStr] = r.time.split(':');
    const hour = parseInt(hourStr, 10) || 0;
    const minute = parseInt(minuteStr, 10) || 0;

    // Construir DateTime exacto en la zona horaria indicada
    const dt = DateTime.fromObject({ year, month, day, hour, minute }, { zone: timezone });

    if (dt >= reference) upcoming.push(r);
    else past.push(r);
  }

  // Sort upcoming asc by datetime, past desc
  upcoming.sort((a, b) => {
    const aBase = DateTime.fromJSDate(new Date(a.date)).setZone(timezone);
    const bBase = DateTime.fromJSDate(new Date(b.date)).setZone(timezone);
    const aDt = aBase.set({ hour: parseInt(a.time.split(':')[0], 10) || 0, minute: parseInt(a.time.split(':')[1], 10) || 0 });
    const bDt = bBase.set({ hour: parseInt(b.time.split(':')[0], 10) || 0, minute: parseInt(b.time.split(':')[1], 10) || 0 });
    return aDt.toMillis() - bDt.toMillis();
  });

  past.sort((a, b) => {
    const aBase = DateTime.fromJSDate(new Date(a.date)).setZone(timezone);
    const bBase = DateTime.fromJSDate(new Date(b.date)).setZone(timezone);
    const aDt = aBase.set({ hour: parseInt(a.time?.split(':')[0] || '0', 10), minute: parseInt(a.time?.split(':')[1] || '0', 10) });
    const bDt = bBase.set({ hour: parseInt(b.time?.split(':')[0] || '0', 10), minute: parseInt(b.time?.split(':')[1] || '0', 10) });
    return bDt.toMillis() - aDt.toMillis();
  });

  const groupByDay = (arr: Reservation[]) => {
    const map = new Map<string, Reservation[]>();
    arr.forEach(r => {
      if (r.date) {
        const dt = DateTime.fromJSDate(new Date(r.date)).setZone(timezone);
        const key = dt.toISODate();
        if (key) { // Comprobar que la clave no es nula
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(r);
        }
      }
    });

    // Ordenar reservas dentro de cada grupo por hora ascendente
    const groups: GroupedReservations[] = Array.from(map.entries()).map(([key, reservations]) => {
      reservations.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      return { key, reservations };
    });
    return groups;
  };

  const upcomingGroups = groupByDay(upcoming).sort((a, b) => {
    const aMs = DateTime.fromISO(a.key, { zone: timezone }).toMillis();
    const bMs = DateTime.fromISO(b.key, { zone: timezone }).toMillis();
    return aMs - bMs; // ascendente
  });

  const pastGroups = groupByDay(past)
    .map(g => ({ ...g, reservations: [...g.reservations].sort((a, b) => (b.time || '').localeCompare(a.time || '')) }))
    .sort((a, b) => {
      const aMs = DateTime.fromISO(a.key, { zone: timezone }).toMillis();
      const bMs = DateTime.fromISO(b.key, { zone: timezone }).toMillis();
      return bMs - aMs; // descendente
    });

  return { upcomingGroups, pastGroups };
}

export default {};


