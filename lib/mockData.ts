import { Reservation, Table } from '@/types';

export const mockTables: Table[] = [
  { id: 'table-1', number: 1, capacity: 2, location: 'interior', isAvailable: true },
  { id: 'table-2', number: 2, capacity: 2, location: 'interior', isAvailable: true },
  { id: 'table-3', number: 3, capacity: 4, location: 'interior', isAvailable: false },
  { id: 'table-4', number: 4, capacity: 4, location: 'interior', isAvailable: true },
  { id: 'table-5', number: 5, capacity: 6, location: 'interior', isAvailable: true },
  { id: 'table-6', number: 6, capacity: 2, location: 'exterior', isAvailable: true },
  { id: 'table-7', number: 7, capacity: 4, location: 'exterior', isAvailable: true },
  { id: 'table-8', number: 8, capacity: 4, location: 'terraza', isAvailable: true },
  { id: 'table-9', number: 9, capacity: 6, location: 'terraza', isAvailable: false },
  { id: 'table-10', number: 10, capacity: 8, location: 'privado', isAvailable: true },
];

// Generar reservas para hoy y próximos días
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(dayAfter.getDate() + 2);

export const mockReservations: Reservation[] = [
  {
    id: 'res-1',
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '+34 612 345 678',
    date: today,
    time: '13:00',
    guests: 2,
    tableId: 'table-1',
    status: 'confirmed',
    specialRequests: 'Mesa junto a la ventana',
    createdAt: new Date(),
  },
  {
    id: 'res-2',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.r@email.com',
    customerPhone: '+34 623 456 789',
    date: today,
    time: '14:30',
    guests: 4,
    tableId: 'table-3',
    status: 'confirmed',
    specialRequests: 'Cumpleaños - traer postre especial',
    createdAt: new Date(),
  },
  {
    id: 'res-3',
    customerName: 'Ana Martínez',
    customerEmail: 'ana.martinez@email.com',
    customerPhone: '+34 634 567 890',
    date: today,
    time: '20:00',
    guests: 2,
    tableId: 'table-6',
    status: 'pending',
    createdAt: new Date(),
  },
  {
    id: 'res-4',
    customerName: 'Juan López',
    customerEmail: 'juan.lopez@email.com',
    customerPhone: '+34 645 678 901',
    date: today,
    time: '21:00',
    guests: 4,
    status: 'pending',
    createdAt: new Date(),
  },
  {
    id: 'res-5',
    customerName: 'Laura Sánchez',
    customerEmail: 'laura.sanchez@email.com',
    customerPhone: '+34 656 789 012',
    date: tomorrow,
    time: '13:30',
    guests: 6,
    tableId: 'table-5',
    status: 'confirmed',
    specialRequests: 'Menú vegano completo',
    createdAt: new Date(),
  },
  {
    id: 'res-6',
    customerName: 'María García',
    customerEmail: 'maria.garcia@email.com',
    customerPhone: '+34 612 345 678',
    date: tomorrow,
    time: '20:30',
    guests: 4,
    tableId: 'table-9',
    status: 'confirmed',
    createdAt: new Date(),
  },
  {
    id: 'res-7',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.r@email.com',
    customerPhone: '+34 623 456 789',
    date: dayAfter,
    time: '19:00',
    guests: 2,
    status: 'pending',
    createdAt: new Date(),
  },
];
