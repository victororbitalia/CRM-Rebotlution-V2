// Tipos principales para el Sistema de Reservas

export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  location: 'interior' | 'exterior' | 'terraza' | 'privado';
  isAvailable: boolean;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  guests: number;
  tableId?: string;
  preferredLocation?: 'interior' | 'exterior' | 'terraza' | 'privado' | 'any';
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: Date;
}

export interface DashboardStats {
  todayReservations: number;
  weekReservations: number;
  averageGuests: number;
  occupancyRate: number;
}
