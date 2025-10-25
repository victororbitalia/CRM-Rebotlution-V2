// Tipos principales para el Sistema de Reservas

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

// Exportar tipos desde otros archivos
export type { Table, Reservation, Zone, TablePosition, TableSize, ZoneDimensions, TableFormData, ZoneFormData, MapData, MapViewMode } from './map';

export interface DashboardStats {
  todayReservations: number;
  weekReservations: number;
  averageGuests: number;
  occupancyRate: number;
}
