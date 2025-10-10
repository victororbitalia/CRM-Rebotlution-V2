import { useState } from 'react';
import { Reservation } from '@/types';
import { ClockIcon, UsersIcon, TableIcon, DocumentIcon, CheckIcon, XIcon } from './Icons';

interface ReservationCardProps {
  reservation: Reservation;
  onStatusChange?: (id: string, status: Reservation['status']) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Reservation>) => void;
}

export default function ReservationCard({ reservation, onStatusChange, onDelete, onUpdate }: ReservationCardProps) {
  const statusColors = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
    seated: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
    completed: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300',
    cancelled: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  };

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    seated: 'En mesa',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  const borderColors = {
    pending: 'border-l-amber-500',
    confirmed: 'border-l-blue-500',
    seated: 'border-l-green-500',
    completed: 'border-l-gray-400',
    cancelled: 'border-l-red-500',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    customerName: reservation.customerName || '',
    customerEmail: reservation.customerEmail || '',
    customerPhone: reservation.customerPhone || '',
    date: new Date(reservation.date).toISOString().slice(0, 10),
    time: reservation.time || '',
    guests: reservation.guests || 1,
    preferredLocation: (reservation as any).preferredLocation || 'any',
    specialRequests: reservation.specialRequests || '',
  });

  const handleSave = async () => {
    if (!onUpdate) {
      setIsEditing(false);
      return;
    }
    await onUpdate(reservation.id, {
      customerName: form.customerName,
      customerEmail: form.customerEmail,
      customerPhone: form.customerPhone,
      date: new Date(form.date),
      time: form.time,
      guests: Number(form.guests),
      // preferredLocation: form.preferredLocation as any, // Hotfix: Se deshabilita temporalmente hasta que la migración se aplique en producción.
      specialRequests: form.specialRequests || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className={`card p-4 hover:shadow-md transition-shadow border-l-4 ${borderColors[reservation.status]}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-base text-[var(--text-primary)] mb-1">{reservation.customerName}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{reservation.customerPhone}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[reservation.status]}`}>
          {statusLabels[reservation.status]}
        </span>
      </div>

      {isEditing ? (
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-1 gap-3">
            <input
              className="input-field"
              type="text"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              placeholder="Nombre del cliente"
            />
            <input
              className="input-field"
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
              placeholder="Email"
            />
            <input
              className="input-field"
              type="tel"
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
              placeholder="Teléfono"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <input
                className="input-field"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
            <input
              className="input-field"
              type="number"
              min={1}
              max={20}
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            />
            <select
              className="input-field"
              value={form.preferredLocation}
              onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })}
            >
              <option value="any">Ubicación: Cualquiera</option>
              <option value="interior">Ubicación: Interior</option>
              <option value="exterior">Ubicación: Exterior</option>
              <option value="terraza">Ubicación: Terraza</option>
              <option value="privado">Ubicación: Privado</option>
            </select>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Peticiones especiales"
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center text-sm text-[var(--text-secondary)]">
            <ClockIcon className="w-4 h-4 mr-2" />
            <span className="font-medium">{new Date(reservation.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span className="font-medium">{reservation.time}</span>
          </div>
          <div className="flex items-center text-sm text-[var(--text-secondary)]">
            <UsersIcon className="w-4 h-4 mr-2" />
            <span>{reservation.guests} {reservation.guests === 1 ? 'persona' : 'personas'}</span>
          </div>
          {reservation.tableId && (
            <div className="flex items-center text-sm text-[var(--text-secondary)]">
              <TableIcon className="w-4 h-4 mr-2" />
              <span>Mesa asignada</span>
            </div>
          )}
          {reservation.specialRequests && (
            <div className="flex items-start text-sm text-[var(--text-secondary)] bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
              <DocumentIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span className="italic">{reservation.specialRequests}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 btn-primary"
            >
              Guardar
            </button>
          </>
        ) : (
          <>
            {onUpdate && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 btn-secondary"
              >
                Editar
              </button>
            )}
            {onStatusChange && reservation.status === 'pending' && (
            <button
              onClick={() => onStatusChange(reservation.id, 'confirmed')}
              className="flex-1 btn-primary flex items-center justify-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              Confirmar
            </button>
            )}
            {onStatusChange && reservation.status === 'confirmed' && (
            <button
              onClick={() => onStatusChange(reservation.id, 'seated')}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <TableIcon className="w-4 h-4" />
              Sentar
            </button>
            )}
            {onStatusChange && reservation.status === 'seated' && (
            <button
              onClick={() => onStatusChange(reservation.id, 'completed')}
              className="flex-1 btn-secondary flex items-center justify-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              Completar
            </button>
            )}
            {onDelete && reservation.status !== 'completed' && (
            <button
              onClick={() => onDelete(reservation.id)}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
              title="Eliminar reserva"
            >
              <XIcon className="w-4 h-4" />
            </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
