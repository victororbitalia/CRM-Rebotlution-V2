// Configuración del restaurante

export interface RestaurantSettings {
  id: string;
  timezone?: string; // IANA timezone, e.g. 'Europe/Madrid'
  
  // Información básica
  restaurantName: string;
  email: string;
  phone: string;
  address: string;
  
  // Configuración de horarios
  schedule: {
    [key: string]: DaySchedule; // 'monday', 'tuesday', etc.
  };
  
  // Configuración de reservas
  reservations: {
    maxAdvanceDays: number; // Días máximos de anticipación para reservar
    minAdvanceHours: number; // Horas mínimas de anticipación
    defaultDuration: number; // Duración por defecto en minutos
    maxGuestsPerReservation: number;
    minGuestsPerReservation: number;
    allowWaitlist: boolean; // Permitir lista de espera
    requireConfirmation: boolean; // Requiere confirmación del restaurante
    autoConfirmAfterMinutes: number; // Auto-confirmar después de X minutos
    defaultPreferredLocation?: TableLocation | 'any'; // Ubicación por defecto para asignación automática
    timezone?: string; // IANA timezone, e.g. 'Europe/Madrid'
  };
  
  // Configuración de mesas
  tables: {
    totalTables: number;
    reservedTablesAlways: number; // Mesas siempre reservadas para walk-ins
    maxOccupancyPercentage: number; // % máximo de ocupación permitido
    allowOverbooking: boolean;
    overbookingPercentage: number;
  };
  
  // Configuración por día de la semana
  weekdayRules: {
    [key: string]: DayRules; // 'monday', 'tuesday', etc.
  };
  
  // Turnos de servicio
  serviceTurns: ServiceTurn[];
  
  // Notificaciones
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    reminderHoursBefore: number;
    sendConfirmationEmail: boolean;
    sendReminderEmail: boolean;
  };
  
  // Políticas
  policies: {
    cancellationHours: number; // Horas antes para cancelar sin penalización
    noShowPolicy: string;
    depositRequired: boolean;
    depositAmount: number;
  };
  
  updatedAt: Date;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string; // "12:00"
  closeTime: string; // "23:00"
  breaks?: TimeSlot[]; // Horarios de descanso
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DayRules {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  maxReservations: number; // Máximo de reservas para ese día
  maxGuestsTotal: number; // Máximo de comensales totales
  tablesAvailable: number; // Mesas disponibles ese día
  specialRules?: string; // Reglas especiales
}

export interface ServiceTurn {
  id: string;
  name: string; // "Almuerzo", "Cena"
  startTime: string;
  endTime: string;
  maxReservations: number;
  daysOfWeek: number[]; // 0=Domingo, 1=Lunes, etc.
}

// Ubicaciones posibles de mesas
export type TableLocation = 'interior' | 'exterior' | 'terraza' | 'privado';



