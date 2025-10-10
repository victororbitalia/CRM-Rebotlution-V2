'use client';

import { useEffect, useState } from 'react';
import { RestaurantSettings, DayRules } from '@/types/settings';
import { defaultSettings } from '@/lib/defaultSettings';
import { CheckIcon } from '@/components/Icons';

export default function SettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'reservations' | 'tables' | 'schedule' | 'notifications' | 'policies'>('general');
  const [saved, setSaved] = useState(false);

  // Cargar ajustes desde API al montar
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const json = await res.json();
        if (json?.success && json.data) {
          setSettings(json.data as RestaurantSettings);
        }
      } catch (e) {
        // dejar valores por defecto si falla
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'No se pudo guardar');
      setSettings(json.data as RestaurantSettings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Error al guardar configuración');
    }
  };

  const updateWeekdayRule = (day: string, field: keyof DayRules, value: any) => {
    setSettings({
      ...settings,
      weekdayRules: {
        ...settings.weekdayRules,
        [day]: {
          ...settings.weekdayRules[day],
          [field]: value,
        },
      },
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '🏢' },
    { id: 'reservations', label: 'Reservas', icon: '📅' },
    { id: 'tables', label: 'Mesas', icon: '🪑' },
    { id: 'schedule', label: 'Horarios', icon: '🕐' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'policies', label: 'Políticas', icon: '📋' },
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
            Configuración del Restaurante
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Ajusta los parámetros según las necesidades de tu negocio
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Guardado
            </>
          ) : (
            'Guardar Cambios'
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="card mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-transparent text-[var(--text-secondary)] hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Información General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Nombre del Restaurante
                </label>
                <input
                  type="text"
                  value={settings.restaurantName}
                  onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservas */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Configuración de Reservas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Días máximos de anticipación
                </label>
                <input
                  type="number"
                  value={settings.reservations.maxAdvanceDays}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, maxAdvanceDays: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="1"
                  max="365"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Cuántos días antes pueden reservar los clientes
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Horas mínimas de anticipación
                </label>
                <input
                  type="number"
                  value={settings.reservations.minAdvanceHours}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, minAdvanceHours: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="0"
                  max="48"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Tiempo mínimo antes de la reserva
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Duración por defecto (minutos)
                </label>
                <input
                  type="number"
                  value={settings.reservations.defaultDuration}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, defaultDuration: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="30"
                  max="300"
                  step="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Ubicación por defecto de reservas
                </label>
                <select
                  value={settings.reservations.defaultPreferredLocation || 'any'}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, defaultPreferredLocation: e.target.value as any }
                  })}
                  className="input-field"
                >
                  <option value="any">Cualquiera</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                  <option value="terraza">Terraza</option>
                  <option value="privado">Privado</option>
                </select>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Se usará al asignar mesa automáticamente si no se especifica una preferencia.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Máximo de comensales por reserva
                </label>
                <input
                  type="number"
                  value={settings.reservations.maxGuestsPerReservation}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, maxGuestsPerReservation: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reservations.allowWaitlist}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, allowWaitlist: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Permitir lista de espera cuando no hay disponibilidad
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.reservations.requireConfirmation}
                  onChange={(e) => setSettings({
                    ...settings,
                    reservations: { ...settings.reservations, requireConfirmation: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Requiere confirmación manual del restaurante
                </span>
              </label>
            </div>
          </div>

          {/* Reglas por día de la semana */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Configuración por Día de la Semana
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Ajusta la capacidad y límites según el día. Útil para reducir capacidad entre semana y aumentarla los fines de semana.
            </p>
            
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-3">{day.label}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Máx. Reservas
                      </label>
                      <input
                        type="number"
                        value={settings.weekdayRules[day.key]?.maxReservations || 0}
                        onChange={(e) => updateWeekdayRule(day.key, 'maxReservations', parseInt(e.target.value))}
                        className="input-field"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Máx. Comensales
                      </label>
                      <input
                        type="number"
                        value={settings.weekdayRules[day.key]?.maxGuestsTotal || 0}
                        onChange={(e) => updateWeekdayRule(day.key, 'maxGuestsTotal', parseInt(e.target.value))}
                        className="input-field"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Mesas Disponibles
                      </label>
                      <input
                        type="number"
                        value={settings.weekdayRules[day.key]?.tablesAvailable || 0}
                        onChange={(e) => updateWeekdayRule(day.key, 'tablesAvailable', parseInt(e.target.value))}
                        className="input-field"
                        min="0"
                        max={settings.tables.totalTables}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mesas */}
      {activeTab === 'tables' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Gestión de Mesas
          </h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Total de mesas
                </label>
                <input
                  type="number"
                  value={settings.tables.totalTables}
                  onChange={(e) => setSettings({
                    ...settings,
                    tables: { ...settings.tables, totalTables: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Mesas reservadas siempre (Walk-ins)
                </label>
                <input
                  type="number"
                  value={settings.tables.reservedTablesAlways}
                  onChange={(e) => setSettings({
                    ...settings,
                    tables: { ...settings.tables, reservedTablesAlways: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="0"
                  max={settings.tables.totalTables}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Mesas que nunca se pueden reservar online (para clientes sin reserva)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Porcentaje máximo de ocupación (%)
                </label>
                <input
                  type="number"
                  value={settings.tables.maxOccupancyPercentage}
                  onChange={(e) => setSettings({
                    ...settings,
                    tables: { ...settings.tables, maxOccupancyPercentage: parseInt(e.target.value) }
                  })}
                  className="input-field"
                  min="50"
                  max="100"
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Limita la ocupación máxima permitida
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                💡 Cálculo Automático
              </h3>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p>• Total de mesas: <strong>{settings.tables.totalTables}</strong></p>
                <p>• Mesas reservadas para walk-ins: <strong>{settings.tables.reservedTablesAlways}</strong></p>
                <p>• Mesas disponibles para reservas online: <strong>{settings.tables.totalTables - settings.tables.reservedTablesAlways}</strong></p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.tables.allowOverbooking}
                  onChange={(e) => setSettings({
                    ...settings,
                    tables: { ...settings.tables, allowOverbooking: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Permitir overbooking (reservar más allá de la capacidad)
                </span>
              </label>

              {settings.tables.allowOverbooking && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Porcentaje de overbooking (%)
                  </label>
                  <input
                    type="number"
                    value={settings.tables.overbookingPercentage}
                    onChange={(e) => setSettings({
                      ...settings,
                      tables: { ...settings.tables, overbookingPercentage: parseInt(e.target.value) }
                    })}
                    className="input-field max-w-xs"
                    min="0"
                    max="50"
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Permite reservar un % extra considerando no-shows
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Horarios */}
      {activeTab === 'schedule' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Horarios de Apertura
          </h2>
          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[var(--text-primary)]">{day.label}</h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.schedule[day.key]?.isOpen || false}
                      onChange={(e) => setSettings({
                        ...settings,
                        schedule: {
                          ...settings.schedule,
                          [day.key]: {
                            ...settings.schedule[day.key],
                            isOpen: e.target.checked,
                          },
                        },
                      })}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-[var(--text-primary)]">Abierto</span>
                  </label>
                </div>
                {settings.schedule[day.key]?.isOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Apertura
                      </label>
                      <input
                        type="time"
                        value={settings.schedule[day.key]?.openTime || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          schedule: {
                            ...settings.schedule,
                            [day.key]: {
                              ...settings.schedule[day.key],
                              openTime: e.target.value,
                            },
                          },
                        })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                        Cierre
                      </label>
                      <input
                        type="time"
                        value={settings.schedule[day.key]?.closeTime || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          schedule: {
                            ...settings.schedule,
                            [day.key]: {
                              ...settings.schedule[day.key],
                              closeTime: e.target.value,
                            },
                          },
                        })}
                        className="input-field"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notificaciones */}
      {activeTab === 'notifications' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Configuración de Notificaciones
          </h2>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailEnabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Activar notificaciones por email
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.smsEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, smsEnabled: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Activar notificaciones por SMS
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sendConfirmationEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sendConfirmationEmail: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Enviar email de confirmación
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.sendReminderEmail}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, sendReminderEmail: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Enviar email recordatorio
                </span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Horas antes para enviar recordatorio
              </label>
              <input
                type="number"
                value={settings.notifications.reminderHoursBefore}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, reminderHoursBefore: parseInt(e.target.value) }
                })}
                className="input-field max-w-xs"
                min="1"
                max="72"
              />
            </div>
          </div>
        </div>
      )}

      {/* Políticas */}
      {activeTab === 'policies' && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Políticas del Restaurante
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Horas antes para cancelar sin penalización
              </label>
              <input
                type="number"
                value={settings.policies.cancellationHours}
                onChange={(e) => setSettings({
                  ...settings,
                  policies: { ...settings.policies, cancellationHours: parseInt(e.target.value) }
                })}
                className="input-field max-w-xs"
                min="0"
                max="72"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Política de no-show
              </label>
              <textarea
                value={settings.policies.noShowPolicy}
                onChange={(e) => setSettings({
                  ...settings,
                  policies: { ...settings.policies, noShowPolicy: e.target.value }
                })}
                className="input-field"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.policies.depositRequired}
                  onChange={(e) => setSettings({
                    ...settings,
                    policies: { ...settings.policies, depositRequired: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  Requiere depósito para reservar
                </span>
              </label>

              {settings.policies.depositRequired && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Monto del depósito (€)
                  </label>
                  <input
                    type="number"
                    value={settings.policies.depositAmount}
                    onChange={(e) => setSettings({
                      ...settings,
                      policies: { ...settings.policies, depositAmount: parseFloat(e.target.value) }
                    })}
                    className="input-field max-w-xs"
                    min="0"
                    step="5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



