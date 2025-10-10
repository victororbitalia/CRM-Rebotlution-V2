'use client';

import { useRestaurant } from '@/context/RestaurantContext';
import { TableIcon, LocationIcon } from '@/components/Icons';
import { useMemo, useState } from 'react';
import { Table } from '@/types';

export default function TablesPage() {
  const { tables, reservations, createTable, toggleTableAvailability } = useRestaurant();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newTable, setNewTable] = useState({ number: '', capacity: '', location: 'interior' as Table['location'] });

  const tablesByLocation = useMemo(() => {
    const grouped: Record<string, Table[]> = {
      interior: [],
      exterior: [],
      terraza: [],
      privado: [],
    };

    tables.forEach(table => {
      grouped[table.location].push(table);
    });

    return grouped;
  }, [tables]);

  const reservationsForDate = useMemo(() => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);
    
    return reservations.filter(r => {
      const resDate = new Date(r.date);
      resDate.setHours(0, 0, 0, 0);
      return resDate.getTime() === date.getTime() && r.status !== 'cancelled';
    });
  }, [reservations, selectedDate]);

  const getTableById = (tableId: string) => {
    return tables.find(t => t.id === tableId);
  };

  const filteredTables = useMemo(() => {
    if (selectedLocation === 'all') {
      return tables;
    }
    return tables.filter(t => t.location === selectedLocation);
  }, [tables, selectedLocation]);

  const stats = useMemo(() => {
    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const availableTables = tables.filter(t => t.isAvailable).length;
    const occupiedTables = tables.length - availableTables;
    const occupancyRate = (occupiedTables / tables.length) * 100;

    return {
      totalTables: tables.length,
      availableTables,
      occupiedTables,
      totalCapacity,
      occupancyRate: occupancyRate.toFixed(0),
    };
  }, [tables]);

  const locationLabels: Record<string, string> = {
    interior: 'Interior',
    exterior: 'Exterior',
    terraza: 'Terraza',
    privado: 'Privado',
  };

  const locationIcons: Record<string, string> = {
    interior: '🏠',
    exterior: '🌳',
    terraza: '☀️',
    privado: '🔒',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Gestión de Mesas
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Visualiza y gestiona la distribución de mesas del restaurante
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Total Mesas</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalTables}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">{stats.availableTables}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Ocupadas</p>
          <p className="text-2xl font-bold text-red-600">{stats.occupiedTables}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Capacidad Total</p>
          <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">Ocupación</p>
          <p className="text-2xl font-bold text-purple-600">{stats.occupancyRate}%</p>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Ubicación
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="input-field"
            >
              <option value="all">Todas las ubicaciones</option>
              <option value="interior">🏠 Interior</option>
              <option value="exterior">🌳 Exterior</option>
              <option value="terraza">☀️ Terraza</option>
              <option value="privado">🔒 Privado</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
              Ver reservas para
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {selectedLocation === 'all' ? (
        <div className="space-y-6">
          {Object.entries(tablesByLocation).map(([location, locationTables]) => (
            <div key={location} className="card p-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <span>{locationIcons[location]}</span>
                <span>{locationLabels[location]}</span>
                <span className="text-sm font-normal text-[var(--text-secondary)]">
                  ({locationTables.length} mesas)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {locationTables.map(table => {
                  const tableReservations = reservationsForDate.filter(r => r.tableId === table.id);
                  const hasReservation = tableReservations.length > 0;

                  return (
                    <div
                      key={table.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        table.isAvailable
                          ? hasReservation
                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-green-300 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                      }`}
                    >
                      <div className="text-center">
                        <TableIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                        <p className="font-semibold text-sm text-[var(--text-primary)]">
                          Mesa {table.number}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          {table.capacity} personas
                        </p>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${
                              table.isAvailable
                                ? hasReservation
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {table.isAvailable
                              ? hasReservation
                                ? 'Reservada'
                                : 'Disponible'
                              : 'Ocupada'}
                          </span>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => toggleTableAvailability(table.id, !table.isAvailable)}
                            className="text-xs px-3 py-1.5 rounded border bg-white hover:bg-gray-50"
                          >
                            {table.isAvailable ? 'Marcar Ocupada' : 'Marcar Disponible'}
                          </button>
                        </div>
                        {hasReservation && (
                          <div className="mt-2 text-xs text-[var(--text-secondary)]">
                            {tableReservations.map(res => (
                              <div key={res.id}>
                                {res.time}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span>{locationIcons[selectedLocation]}</span>
            <span>{locationLabels[selectedLocation]}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredTables.map(table => {
              const tableReservations = reservationsForDate.filter(r => r.tableId === table.id);
              const hasReservation = tableReservations.length > 0;

              return (
                <div
                  key={table.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    table.isAvailable
                      ? hasReservation
                        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-green-300 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="text-center">
                    <TableIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      Mesa {table.number}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      {table.capacity} personas
                    </p>
                    <div>
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium border ${
                          table.isAvailable
                            ? hasReservation
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {table.isAvailable
                          ? hasReservation
                            ? 'Reservada'
                            : 'Disponible'
                          : 'Ocupada'}
                      </span>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => toggleTableAvailability(table.id, !table.isAvailable)}
                        className="text-xs px-3 py-1.5 rounded border bg-white hover:bg-gray-50"
                      >
                        {table.isAvailable ? 'Marcar Ocupada' : 'Marcar Disponible'}
                      </button>
                    </div>
                    {hasReservation && (
                      <div className="mt-2 text-xs text-[var(--text-secondary)]">
                        {tableReservations.map(res => (
                          <div key={res.id}>
                            {res.time}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crear nueva mesa */}
      <div className="mt-6 card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Crear Mesa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="number"
            className="input-field"
            placeholder="Número"
            value={newTable.number}
            onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
          />
          <input
            type="number"
            className="input-field"
            placeholder="Capacidad"
            value={newTable.capacity}
            onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
          />
          <select
            className="input-field"
            value={newTable.location}
            onChange={(e) => setNewTable({ ...newTable, location: e.target.value as Table['location'] })}
          >
            <option value="interior">Interior</option>
            <option value="exterior">Exterior</option>
            <option value="terraza">Terraza</option>
            <option value="privado">Privado</option>
          </select>
          <button
            className="btn-primary"
            onClick={async () => {
              if (!newTable.number || !newTable.capacity) return;
              await createTable({
                number: parseInt(newTable.number, 10),
                capacity: parseInt(newTable.capacity, 10),
                location: newTable.location,
              });
              setNewTable({ number: '', capacity: '', location: 'interior' });
            }}
          >
            Crear Mesa
          </button>
        </div>
      </div>
      <div className="mt-6 card p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Reservas para {new Date(selectedDate).toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
        {reservationsForDate.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-center py-8">
            No hay reservas para esta fecha
          </p>
        ) : (
          <div className="space-y-2">
            {reservationsForDate
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(reservation => {
                const table = reservation.tableId ? getTableById(reservation.tableId) : null;
                return (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                        reservation.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {reservation.status === 'confirmed' ? '✓' : '○'}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-[var(--text-primary)]">
                          {reservation.customerName}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {reservation.time} • {reservation.guests} personas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {table ? (
                        <div>
                          <p className="font-semibold text-sm text-[var(--text-primary)]">
                            Mesa {table.number}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {locationIcons[table.location]} {locationLabels[table.location]}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">
                          Sin mesa asignada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}