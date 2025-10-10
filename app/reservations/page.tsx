'use client';

import { useRestaurant } from '@/context/RestaurantContext';
import ReservationCard from '@/components/ReservationCard';
import { PlusIcon, XIcon, FilterIcon, SearchIcon } from '@/components/Icons';
import { useState, useMemo, useEffect } from 'react';
import { Reservation } from '@/types';
import { classifyAndGroupReservations } from '@/lib/reservationUtils';
import { DateTime } from 'luxon';

export default function ReservationsPage() {
  const { reservations, addReservation, updateReservation, deleteReservation, tables, settings } = useRestaurant();
  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: 2,
    preferredLocation: 'any',
    specialRequests: '',
  });
  // Widget: fecha y hora actuales para el gestor
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  useEffect(() => {
    const tick = () => setCurrentDateTime(new Date());
    // Actualizar cada minuto para mantener la hora visible
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Limpiar error anterior

    try {
      // Validaciones en UI basadas en configuración y datos locales
      const tz = settings?.reservations?.timezone || settings?.timezone || 'Europe/Madrid';
      const durationMinutes = Number(settings?.reservations?.defaultDuration || 120);
      const minAdvanceHours = Number(settings?.reservations?.minAdvanceHours || 0);

      if (!formData.date || !formData.time) {
        setFormError('Debes indicar fecha y hora');
        return;
      }

      // Construir DateTime de reserva con zona horaria
      const dateISO = formData.date.includes('T') ? formData.date.split('T')[0] : formData.date;
      const dayDate = DateTime.fromISO(dateISO, { zone: tz });
      const [hStr, mStr] = (formData.time || '').split(':');
      const hour = parseInt(hStr || '', 10);
      const minute = parseInt(mStr || '', 10);
      if (Number.isNaN(hour) || Number.isNaN(minute)) {
        setFormError('Hora inválida (usa formato HH:MM)');
        return;
      }
      const reservationDT = dayDate.set({ hour, minute, second: 0, millisecond: 0 });
      if (!reservationDT.isValid) {
        setFormError('Fecha u hora inválidas');
        return;
      }

      // Anticipación mínima (minAdvanceHours)
      if (minAdvanceHours > 0) {
        const nowTz = DateTime.now().setZone(tz);
        const diffMinutes = reservationDT.diff(nowTz, 'minutes').minutes;
        if (diffMinutes < minAdvanceHours * 60) {
          setFormError(`Las reservas requieren al menos ${minAdvanceHours} ${minAdvanceHours === 1 ? 'hora' : 'horas'} de anticipación`);
          return;
        }
      }

      // Dentro del horario de apertura/cierre y duración
      const dayNames = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const dayKey = dayNames[(reservationDT.weekday) % 7];
      const sched = settings?.schedule?.[dayKey];
      if (!sched || sched.isOpen === false) {
        setFormError('El restaurante no está abierto este día');
        return;
      }
      const [openH, openM] = (sched.openTime || '00:00').split(':').map((v: string) => parseInt(v, 10) || 0);
      const [closeHRaw, closeM] = (sched.closeTime || '23:59').split(':').map((v: string) => parseInt(v, 10) || 0);
      const closingIsMidnight = closeHRaw === 0 && closeM === 0; // interpretar 00:00 como fin de día
      const closeH = closingIsMidnight ? 24 : closeHRaw;
      const openDT = dayDate.set({ hour: openH, minute: openM, second: 0, millisecond: 0 });
      const closeDT = dayDate.plus({ days: closeH === 24 ? 1 : 0 }).set({ hour: closeH % 24, minute: closeM, second: 0, millisecond: 0 });
      if (reservationDT < openDT) {
        setFormError(`La hora seleccionada está antes de la apertura (${sched.openTime})`);
        return;
      }
      const reservationEnd = reservationDT.plus({ minutes: durationMinutes });
      if (reservationEnd > closeDT) {
        setFormError(`La reserva excede el horario de cierre (${sched.closeTime}) considerando la duración (${durationMinutes} min)`);
        return;
      }

      // Límites diarios: maxReservations y maxGuestsTotal
      const weekdayRules = settings?.weekdayRules || {};
      const dayRule = weekdayRules?.[dayKey];
      if (!dayRule) {
        setFormError('No hay reglas de capacidad definidas para este día');
        return;
      }
      const dayStart = reservationDT.startOf('day').toJSDate().getTime();
      const dayEnd = reservationDT.endOf('day').toJSDate().getTime();
      const consideredStatuses: Reservation['status'][] = ['pending','confirmed'];
      const existingSameDay = reservations.filter(r => {
        const t = new Date(r.date).getTime();
        return t >= dayStart && t <= dayEnd && consideredStatuses.includes(r.status);
      });
      if (existingSameDay.length >= (dayRule.maxReservations || 50)) {
        setFormError('No hay disponibilidad para este día. Límite de reservas alcanzado.');
        return;
      }
      const totalGuestsDay = existingSameDay.reduce((acc, r) => acc + r.guests, 0);
      if (totalGuestsDay + formData.guests > (dayRule.maxGuestsTotal || 100)) {
        const remaining = Math.max(0, (dayRule.maxGuestsTotal || 100) - totalGuestsDay);
        setFormError(`No hay disponibilidad: límite de comensales alcanzado. Quedan ${remaining} plazas.`);
        return;
      }

      // Capacidad y disponibilidad de mesas para la hora seleccionada
      const preferredLocation = (formData.preferredLocation || settings?.reservations?.defaultPreferredLocation || 'any') as string;
      const candidateTables = tables.filter(t => t.isAvailable && t.capacity >= formData.guests && (preferredLocation === 'any' || t.location === preferredLocation));
      if (candidateTables.length === 0) {
        setFormError('No hay mesas con capacidad suficiente para esta preferencia.');
        return;
      }
      // Contar mesas ya ocupadas a esa hora entre las candidatas
      const candidateIds = new Set(candidateTables.map(t => t.id));
      const reservedAtSlot = existingSameDay.filter(r => r.time === formData.time && r.tableId && candidateIds.has(r.tableId)).length;
      const reservedTablesAlways = Number(settings?.tables?.reservedTablesAlways || 0);
      const availableCount = candidateTables.length - reservedAtSlot - reservedTablesAlways;
      if (availableCount <= 0) {
        setFormError('No hay mesas disponibles para esa hora considerando capacidad y mesas reservadas para walk-ins.');
        return;
      }

      await addReservation({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: new Date(formData.date),
        time: formData.time,
        guests: formData.guests,
        preferredLocation: formData.preferredLocation as any,
        // Reservas creadas manualmente desde el Dashboard quedan confirmadas por defecto
        status: 'confirmed',
        specialRequests: formData.specialRequests || undefined,
      });

      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        time: '',
        guests: 2,
        preferredLocation: 'any',
        specialRequests: '',
      });
      setShowForm(false);
    } catch (error: any) {
      console.error('Error al crear la reserva:', error);
      setFormError(error.message || 'Ocurrió un error inesperado.');
    }
  };

  const filteredReservations = useMemo(() => {
    let filtered = [...reservations];

    if (filterDate !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filterDate === 'today') {
        filtered = filtered.filter(r => {
          const resDate = new Date(r.date);
          resDate.setHours(0, 0, 0, 0);
          return resDate.getTime() === today.getTime();
        });
      } else if (filterDate === 'upcoming') {
        filtered = filtered.filter(r => {
          const resDate = new Date(r.date);
          return resDate >= today;
        });
      } else if (filterDate === 'past') {
        filtered = filtered.filter(r => {
          const resDate = new Date(r.date);
          return resDate < today;
        });
      }
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    return filtered.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
  }, [reservations, filterDate, filterStatus]);

  // Clasificar y agrupar según timezone de settings (fallback Europe/Madrid)
  const restaurantContext = useRestaurant() as any;
  const timezone = restaurantContext?.settings?.reservations?.timezone || restaurantContext?.settings?.timezone || 'Europe/Madrid';
  const { upcomingGroups, pastGroups } = classifyAndGroupReservations(filteredReservations, timezone, new Date());

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    updateReservation(id, { status });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      deleteReservation(id);
    }
  };

  const formatHeaderDate = (date: Date) => {
    const formatted = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            Gestión de Reservas
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Administra todas las reservas del restaurante
          </p>
        </div>
        {/* Widget fecha y hora actual */}
        <div className="flex items-center gap-4">
          <div className="text-sm text-[var(--text-secondary)]">
            <div className="font-medium text-[var(--text-primary)]">
              {new Date(currentDateTime).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/(^\w)/, c => c.toUpperCase())}
            </div>
            <div className="text-xs">{currentDateTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {showForm ? <XIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
          {showForm ? 'Cancelar' : 'Nueva Reserva'}
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
            Nueva Reserva
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Nombre del Cliente *
              </label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="input-field"
                placeholder="María García"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="input-field"
                placeholder="maria@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="input-field"
                placeholder="+34 612 345 678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Número de Personas *
              </label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Hora *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Ubicación Preferida
              </label>
              <select
                value={formData.preferredLocation}
                onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                className="input-field"
              >
                <option value="any">Cualquiera</option>
                <option value="interior">Interior</option>
                <option value="exterior">Exterior</option>
                <option value="terraza">Terraza</option>
                <option value="privado">Privado</option>
              </select>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Se asignará mesa automáticamente según esta preferencia
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Peticiones Especiales
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Alergias, preferencias de mesa, celebraciones..."
              />
            </div>

            {formError && (
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-sm text-red-700 rounded-lg p-3" role="alert">
                <p className="font-bold mb-1">No se pudo crear la reserva</p>
                <p>{formError}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <button type="submit" className="w-full btn-primary">
                Crear Reserva
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Filtrar por Fecha
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="input-field"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="upcoming">Próximas</option>
              <option value="past">Pasadas</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Filtrar por Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="seated">En mesa</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg font-medium text-sm border border-blue-200 dark:border-blue-800">
              {filteredReservations.length} {filteredReservations.length === 1 ? 'reserva' : 'reservas'}
            </div>
          </div>
        </div>
      </div>

      {/* Renderizar próximas */}
      {upcomingGroups.length === 0 && pastGroups.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-[var(--text-secondary)] text-base">
            No se encontraron reservas con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Próximas */}
          {upcomingGroups.map(group => (
            <div key={group.key}>
              <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-primary)]/60">
                <h2 className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide mb-3">
                  {formatHeaderDate(new Date(group.key))}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.reservations.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onUpdate={(id, updates) => updateReservation(id, updates)}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Separador y pasadas (si corresponde) */}
          {(filterDate === 'all' || filterDate === 'past') && pastGroups.length > 0 && (
            <div className="py-6">
              <div className="border-t border-[var(--border-secondary)] pt-4">
                <h3 className="text-sm text-[var(--text-secondary)]">Reservas pasadas</h3>
              </div>
            </div>
          )}

          {((filterDate === 'all') || (filterDate === 'past')) && pastGroups.map(group => (
            <div key={group.key}>
              <div className="sticky top-0 z-10 bg-[var(--bg-primary)]/80 backdrop-blur supports-[backdrop-filter]:bg-[var(--bg-primary)]/60">
                <h2 className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide mb-3">
                  {formatHeaderDate(new Date(group.key))}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.reservations.map(reservation => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onUpdate={(id, updates) => updateReservation(id, updates)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}