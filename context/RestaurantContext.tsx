'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Reservation, Table } from '@/types';
import { mockReservations, mockTables } from '@/lib/mockData';

interface RestaurantContextType {
  reservations: Reservation[];
  tables: Table[];
  settings?: any;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  getReservationsByDate: (date: Date) => Reservation[];
  createTable: (data: Pick<Table, 'number' | 'capacity' | 'location'> & { isAvailable?: boolean }) => Promise<void>;
  toggleTableAvailability: (id: string, isAvailable: boolean) => Promise<void>;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Cargar reservas desde la API al montar
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await fetch('/api/reservations', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          const parsed: Reservation[] = json.data.map((r: any) => ({
            ...r,
            date: new Date(r.date),
            createdAt: r.createdAt ? new Date(r.createdAt) : new Date(),
          }));
          setReservations(parsed);
        }
      } catch (e) {
        // Si falla la API, mantener vacío (o podríamos fallback a mock)
      }
    };
    const loadTables = async () => {
      try {
        const res = await fetch('/api/tables', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          setTables(json.data);
        }
      } catch (e) {
        // mantener vacío en caso de error
      }
    };
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success) setSettings(json.data);
      } catch (e) {}
    };
    loadReservations();
    loadTables();
    loadSettings();
  }, []);

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt'>) => {
    // Persistir en backend
    const normalizedDate = reservation.date instanceof Date
      ? reservation.date.toISOString().split('T')[0]
      : reservation.date;

    const payload = {
      ...reservation,
      date: normalizedDate,
    } as any;
    
    console.log('Enviando reserva:', payload);
    
    const res = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Source': 'dashboard' },
      body: JSON.stringify(payload),
    });
    
    const json = await res.json();
    console.log('Respuesta del servidor:', { status: res.status, json });
    
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo crear la reserva');
    }
    const created = json.data;
    const newReservation: Reservation = {
      ...created,
      date: new Date(created.date),
      createdAt: created.createdAt ? new Date(created.createdAt) : new Date(),
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    const payload: any = { ...updates };
    if (updates.date instanceof Date) payload.date = updates.date.toISOString();

    // Si solo actualizamos el estado, usar endpoint dedicado de estado (PATCH)
    const payloadKeys = Object.keys(payload);
    const isOnlyStatusUpdate = payloadKeys.length === 1 && payloadKeys[0] === 'status';

    const endpoint = isOnlyStatusUpdate
      ? `/api/reservations/${id}/status`
      : `/api/reservations/${id}`;
    const method = isOnlyStatusUpdate ? 'PATCH' : 'PUT';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo actualizar la reserva');
    }
    const updated = json.data;
    setReservations(prev =>
      prev.map(res => (res.id === id ? {
        ...res,
        ...updated,
        date: updated.date ? new Date(updated.date) : res.date,
        createdAt: updated.createdAt ? new Date(updated.createdAt) : res.createdAt,
      } : res))
    );
  };

  const deleteReservation = async (id: string) => {
    const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.error || 'No se pudo eliminar la reserva');
    }
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  const createTable = async (data: Pick<Table, 'number' | 'capacity' | 'location'> & { isAvailable?: boolean }) => {
    const res = await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) throw new Error(json?.error || 'No se pudo crear la mesa');
    setTables(prev => [...prev, json.data as Table]);
  };

  const toggleTableAvailability = async (id: string, isAvailable: boolean) => {
    const res = await fetch(`/api/tables/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable }),
    });
    const json = await res.json();
    if (!res.ok || !json?.success) throw new Error(json?.error || 'No se pudo actualizar la mesa');
    setTables(prev => prev.map(t => (t.id === id ? (json.data as Table) : t)));
  };

  const getReservationsByDate = (date: Date) => {
    return reservations.filter(res => {
      const resDate = new Date(res.date);
      return resDate.toDateString() === date.toDateString();
    });
  };

  return (
    <RestaurantContext.Provider
      value={{
        reservations,
        tables,
        settings,
        addReservation,
        updateReservation,
        deleteReservation,
        getReservationsByDate,
        createTable,
        toggleTableAvailability,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
