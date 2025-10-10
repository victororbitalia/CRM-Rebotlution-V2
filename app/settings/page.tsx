'use client';

import { useEffect, useState } from 'react';
import { RestaurantSettings, DayRules } from '@/types/settings';
import { defaultSettings } from '@/lib/defaultSettings';
import { CheckIcon } from '@/components/Icons';

export default function SettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'reservations' | 'tables'>('general');
  const [saved, setSaved] = useState(false);
  
  // Estados para controlar los desplegables
  const [expandedSections, setExpandedSections] = useState({
    reservations: true,
    schedule: true,
    capacity: true,
  });
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          <div className="card overflow-hidden">
            <button
              onClick={() => toggleSection('reservations')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Configuración de Reservas
              </h2>
              <svg
                className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${expandedSections.reservations ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.reservations && (
              <div className="px-6 pb-6">
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
            )}
          </div>

          {/* Horarios de apertura - Integrado en la pestaña de reservas */}
          <div className="card overflow-hidden">
            <button
              onClick={() => toggleSection('schedule')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Horarios de Apertura
              </h2>
              <svg
                className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${expandedSections.schedule ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.schedule && (
              <div className="px-6 pb-6">
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Define los días y horas de funcionamiento del restaurante. Las reservas solo se permitirán dentro de estos horarios.
            </p>
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
          </div>

          {/* Reglas por día de la semana */}
          <div className="card overflow-hidden">
            <button
              onClick={() => toggleSection('capacity')}
              className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Configuración de Capacidad
              </h2>
              <svg
                className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${expandedSections.capacity ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {expandedSections.capacity && (
              <div className="px-6 pb-6">
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
            )}
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

            {/* Notificaciones por Email - Ahora funcional */}
            <div className="card p-6 mt-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Notificaciones por Email
              </h2>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                  ✅ Funcionalidad Activada
                </h3>
                <div className="text-sm text-green-800 dark:text-green-200">
                  <p>El sistema ahora puede enviar emails de confirmación automáticos cuando se crean reservas.</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications?.emailEnabled || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emailEnabled: e.target.checked
                      }
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
                    checked={settings.notifications?.sendConfirmationEmail || false}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        sendConfirmationEmail: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    Enviar email de confirmación al crear reservas
                  </span>
                </label>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
                ⚠️ Funcionalidades Pendientes
              </h3>
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p>Las siguientes funcionalidades están configuradas pero no están activas actualmente:</p>
                <ul className="mt-2 ml-4 list-disc space-y-1">
                  <li>Notificaciones por SMS</li>
                  <li>Emails recordatorio automáticos</li>
                  <li>Políticas de depósitos y cancelaciones</li>
                  <li>Sistema de overbooking</li>
                </ul>
                <p className="mt-2">Estas funcionalidades se implementarán en futuras actualizaciones.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



