'use client';

import { useRestaurant } from '@/context/RestaurantContext';
import StatCard from '@/components/StatCard';
import ReservationCard from '@/components/ReservationCard';
import { CalendarIcon, UsersIcon, TableIcon, StarIcon } from '@/components/Icons';
import { useEffect, useMemo, useState } from 'react';

export default function Dashboard() {
  const { reservations, tables, updateReservation } = useRestaurant();
  const [dbStats, setDbStats] = useState<{ today: number; week: number; average: number; occupancyRate: number } | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && json.data) {
          setDbStats({
            today: json.data.reservations.today,
            week: json.data.reservations.week,
            average: json.data.guests.average,
            occupancyRate: json.data.tables.occupancyRate,
          });
        }
      } catch {}
    };
    loadStats();
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate.getTime() === today.getTime();
    });

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= weekStart && resDate < weekEnd;
    });

    const totalGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);
    const avgGuests = todayReservations.length > 0 ? totalGuests / todayReservations.length : 0;

    const occupiedTables = tables.filter(t => !t.isAvailable).length;
    const occupancyRate = (occupiedTables / tables.length) * 100;

    return {
      todayReservations: todayReservations.length,
      weekReservations: weekReservations.length,
      averageGuests: avgGuests.toFixed(1),
      occupancyRate: occupancyRate.toFixed(0),
    };
  }, [reservations, tables]);

  // Obtener reservas de hoy
  const todayReservations = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations
      .filter(r => {
        const resDate = new Date(r.date);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === today.getTime();
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [reservations]);

  const handleStatusChange = (id: string, status: any) => {
    updateReservation(id, { status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Resumen de actividad del restaurante
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Reservas Hoy"
          value={dbStats ? dbStats.today : stats.todayReservations}
          icon={<CalendarIcon className="w-5 h-5" />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Reservas Semana"
          value={dbStats ? dbStats.week : stats.weekReservations}
          icon={<CalendarIcon className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Promedio Comensales"
          value={dbStats ? dbStats.average : stats.averageGuests}
          icon={<UsersIcon className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Ocupación Mesas"
          value={`${dbStats ? dbStats.occupancyRate : stats.occupancyRate}%`}
          icon={<TableIcon className="w-5 h-5" />}
          color="orange"
        />
      </div>

      {/* Reservas de hoy */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
              Reservas de Hoy
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800">
            {todayReservations.length} {todayReservations.length === 1 ? 'reserva' : 'reservas'}
          </span>
        </div>

        {todayReservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-[var(--text-secondary)] text-base">
              No hay reservas programadas para hoy
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayReservations.map(reservation => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actividad reciente */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">
          Actividad Reciente
        </h2>
        <div className="space-y-2">
          {reservations.slice(0, 5).map(res => {
            const statusConfig = {
              confirmed: { icon: '✓', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
              pending: { icon: '○', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
              seated: { icon: '●', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
              completed: { icon: '✓', color: 'text-gray-600 bg-gray-50 dark:bg-gray-700' },
              cancelled: { icon: '✕', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
            };
            const config = statusConfig[res.status];
            
            return (
              <div
                key={res.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${config.color}`}>
                    {config.icon}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm">
                      {res.customerName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {res.guests} {res.guests === 1 ? 'persona' : 'personas'} • {res.time}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-secondary)] font-medium">
                  {new Date(res.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
