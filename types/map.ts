export interface TablePosition {
  x: number;
  y: number;
}

export interface TableSize {
  width: number;
  height: number;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  location: 'interior' | 'terraza' | 'exterior' | 'privado';
  isAvailable: boolean;
  position?: TablePosition;
  size?: TableSize;
  shape: 'square' | 'rectangle' | 'circle';
  status: 'available' | 'reserved' | 'occupied' | 'blocked';
  zoneId?: string;
  reservationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ZoneDimensions {
  width: number;
  height: number;
}

export interface ZonePosition {
  x: number;
  y: number;
}

export interface Zone {
  id: string;
  name: string;
  type: 'interior' | 'terraza' | 'exterior' | 'privado';
  dimensions: ZoneDimensions;
  position: ZonePosition;
  color: string;
  tables: Table[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MapData {
  zones: Zone[];
  tables: Table[];
}

export interface TableFormData {
  number: string;
  capacity: number;
  location: string;
  shape: 'square' | 'rectangle' | 'circle';
  size: TableSize;
  position: TablePosition;
  zoneId?: string;
}

export interface ZoneFormData {
  name: string;
  type: 'interior' | 'terraza' | 'exterior' | 'privado';
  dimensions: ZoneDimensions;
  position: ZonePosition;
  color: string;
}

export interface MapViewMode {
  mode: 'edit' | 'view';
  selectedDate?: string;
}

// Tipo para reservas (compatible con el modelo de Prisma)
export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';
  specialRequests?: string;
  tableId?: string;
  createdAt: Date;
  updatedAt: Date;
}