import { RestaurantSettings } from '@/types/settings';

export const defaultSettings: RestaurantSettings = {
  id: 'settings-1',
  
  // Información básica
  restaurantName: 'REBOTLUTION Restaurant',
  email: 'info@rebotlution.com',
  phone: '+34 900 123 456',
  address: 'Calle Principal, 123, Madrid',
  
  // Configuración de horarios
  schedule: {
    monday: { isOpen: true, openTime: '12:00', closeTime: '23:00' },
    tuesday: { isOpen: true, openTime: '12:00', closeTime: '23:00' },
    wednesday: { isOpen: true, openTime: '12:00', closeTime: '23:00' },
    thursday: { isOpen: true, openTime: '12:00', closeTime: '23:00' },
    friday: { isOpen: true, openTime: '12:00', closeTime: '00:00' },
    saturday: { isOpen: true, openTime: '12:00', closeTime: '00:00' },
    sunday: { isOpen: true, openTime: '12:00', closeTime: '23:00' },
  },
  
  // Configuración de reservas
  reservations: {
    maxAdvanceDays: 30,
    minAdvanceHours: 2,
    defaultDuration: 120, // 2 horas
    maxGuestsPerReservation: 12,
    minGuestsPerReservation: 1,
    allowWaitlist: true,
    requireConfirmation: false,
    autoConfirmAfterMinutes: 30,
    defaultPreferredLocation: 'any',
    timezone: 'Europe/Madrid',
  },
  
  // Configuración de mesas
  tables: {
    totalTables: 10,
    reservedTablesAlways: 2, // 2 mesas siempre libres para walk-ins
    maxOccupancyPercentage: 100,
    allowOverbooking: false,
    overbookingPercentage: 0,
  },
  
  // Configuración por día de la semana
  weekdayRules: {
    monday: {
      day: 'monday',
      maxReservations: 20,
      maxGuestsTotal: 40,
      tablesAvailable: 8, // 10 total - 2 reservadas = 8
    },
    tuesday: {
      day: 'tuesday',
      maxReservations: 20,
      maxGuestsTotal: 40,
      tablesAvailable: 8,
    },
    wednesday: {
      day: 'wednesday',
      maxReservations: 20,
      maxGuestsTotal: 40,
      tablesAvailable: 8,
    },
    thursday: {
      day: 'thursday',
      maxReservations: 25,
      maxGuestsTotal: 50,
      tablesAvailable: 9,
    },
    friday: {
      day: 'friday',
      maxReservations: 30,
      maxGuestsTotal: 60,
      tablesAvailable: 10, // Todas disponibles
      specialRules: 'Fin de semana - capacidad completa',
    },
    saturday: {
      day: 'saturday',
      maxReservations: 30,
      maxGuestsTotal: 60,
      tablesAvailable: 10,
      specialRules: 'Fin de semana - capacidad completa',
    },
    sunday: {
      day: 'sunday',
      maxReservations: 25,
      maxGuestsTotal: 50,
      tablesAvailable: 9,
    },
  },
  
  // Turnos de servicio
  serviceTurns: [
    {
      id: 'turn-1',
      name: 'Almuerzo',
      startTime: '12:00',
      endTime: '16:00',
      maxReservations: 15,
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Todos los días
    },
    {
      id: 'turn-2',
      name: 'Cena',
      startTime: '19:00',
      endTime: '23:00',
      maxReservations: 20,
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    },
  ],
  
  // Notificaciones
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    reminderHoursBefore: 24,
    sendConfirmationEmail: true,
    sendReminderEmail: true,
  },
  
  // Políticas
  policies: {
    cancellationHours: 24,
    noShowPolicy: 'Se bloqueará la posibilidad de reservar en el futuro',
    depositRequired: false,
    depositAmount: 0,
  },
  
  updatedAt: new Date(),
};



