'use client';

import { useState, useEffect } from 'react';
import { Table, Zone, TableFormData, ZoneFormData, Reservation } from '@/types/map';
import RestaurantMap from '@/components/RestaurantMap';
import MapEditTools from '@/components/MapEditTools';

export default function TablesMapPage() {
  const [viewMode, setViewMode] = useState<'edit' | 'view'>('view');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar zonas
        const zonesResponse = await fetch('/api/zones');
        const zonesData = await zonesResponse.json();
        if (zonesData.success) {
          setZones(zonesData.data);
        }
        
        // Cargar mesas
        const tablesResponse = await fetch('/api/tables');
        const tablesData = await tablesResponse.json();
        if (tablesData.success) {
          setTables(tablesData.data);
        }
        
        // Cargar reservas para la fecha seleccionada
        if (selectedDate) {
          const reservationsResponse = await fetch(`/api/reservations?date=${selectedDate}`);
          const reservationsData = await reservationsResponse.json();
          if (reservationsData.success) {
            setReservations(reservationsData.data);
            
            // Actualizar estado de las mesas según las reservas
            const updatedTables = tablesData.data.map((table: Table) => {
              const hasReservation = reservationsData.data.some(
                (r: Reservation) => r.tableId === table.id && r.status !== 'cancelled'
              );
              
              return {
                ...table,
                status: hasReservation ? 'reserved' : 'available',
                reservationId: hasReservation 
                  ? reservationsData.data.find((r: Reservation) => r.tableId === table.id)?.id 
                  : undefined,
              };
            });
            
            setTables(updatedTables);
          }
        }
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del mapa');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedDate]);

  // Manejar cambio de fecha
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  // Manejar actualización de una mesa
  const handleTableUpdate = async (tableId: string, updates: Partial<Table>) => {
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      if (data.success) {
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === tableId ? { ...table, ...updates } : table
          )
        );
      } else {
        setError(data.error || 'Error al actualizar la mesa');
      }
    } catch (err) {
      console.error('Error al actualizar mesa:', err);
      setError('Error al actualizar la mesa');
    }
  };

  // Manejar adición de una nueva mesa
  const handleAddTable = async (tableData: TableFormData) => {
    try {
      const response = await fetch('/api/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tableData),
      });
      
      const data = await response.json();
      if (data.success) {
        setTables(prevTables => [...prevTables, data.data]);
      } else {
        setError(data.error || 'Error al crear la mesa');
      }
    } catch (err) {
      console.error('Error al crear mesa:', err);
      setError('Error al crear la mesa');
    }
  };

  // Manejar adición de una nueva zona
  const handleAddZone = async (zoneData: ZoneFormData) => {
    try {
      const response = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zoneData),
      });
      
      const data = await response.json();
      if (data.success) {
        setZones(prevZones => [...prevZones, data.data]);
      } else {
        setError(data.error || 'Error al crear la zona');
      }
    } catch (err) {
      console.error('Error al crear zona:', err);
      setError('Error al crear la zona');
    }
  };

  // Manejar eliminación de una mesa
  const handleDeleteTable = async (tableId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta mesa?')) return;
    
    try {
      const response = await fetch(`/api/tables/${tableId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setTables(prevTables => prevTables.filter(table => table.id !== tableId));
        setSelectedTableId(null);
      } else {
        setError(data.error || 'Error al eliminar la mesa');
      }
    } catch (err) {
      console.error('Error al eliminar mesa:', err);
      setError('Error al eliminar la mesa');
    }
  };

  // Manejar eliminación de una zona
  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta zona?')) return;
    
    try {
      const response = await fetch(`/api/zones/${zoneId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        setZones(prevZones => prevZones.filter(zone => zone.id !== zoneId));
        
        // Actualizar mesas que estaban en esta zona
        setTables(prevTables => 
          prevTables.map(table => 
            table.zoneId === zoneId 
              ? { ...table, zoneId: undefined, location: 'interior' }
              : table
          )
        );
      } else {
        setError(data.error || 'Error al eliminar la zona');
      }
    } catch (err) {
      console.error('Error al eliminar zona:', err);
      setError('Error al eliminar la zona');
    }
  };

  // Obtener detalles de una mesa seleccionada
  const selectedTable = selectedTableId 
    ? tables.find(table => table.id === selectedTableId)
    : null;

  // Obtener reservas de la mesa seleccionada
  const selectedTableReservations = selectedTableId
    ? reservations.filter(r => r.tableId === selectedTableId)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cabecera de la página */}
      <div className="page-header flex justify-between items-center mb-5 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Mapa de Mesas
          </h1>
          <p className="text-sm text-text-secondary">
            Organiza visualmente tu restaurante y gestiona las reservas
          </p>
        </div>
        
        <div className="controls flex gap-3 items-center">
          {/* Selector de fecha para modo vista */}
          {viewMode === 'view' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-surface text-text-primary"
            />
          )}
          
          {/* Interruptor de modo vista/edición */}
          <div className="flex bg-surface-hover rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('view')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'view'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Ver Reservas
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                viewMode === 'edit'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Editar Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg mb-5 text-danger-800 text-sm">
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="flex justify-center items-center h-48 text-base text-text-muted">
          Cargando mapa de mesas...
        </div>
      )}

      {/* Contenido principal */}
      {!loading && (
        <div className="flex flex-col gap-5">
          {/* Herramientas de edición en modo edición */}
          {viewMode === 'edit' && (
            <MapEditTools
              onAddTable={handleAddTable}
              onAddZone={handleAddZone}
              tablesCount={tables.length}
              zonesCount={zones.length}
            />
          )}
          
          {/* Mapa del restaurante */}
          <div style={{ flex: 1 }}>
            <RestaurantMap
              zones={zones}
              tables={tables}
              onTableUpdate={handleTableUpdate}
              onTableSelect={setSelectedTableId}
              selectedTableId={selectedTableId}
              editMode={viewMode === 'edit'}
              date={selectedDate}
            />
          </div>
          
          {/* Panel lateral con detalles de la mesa seleccionada */}
          {selectedTable && (
            <div className="card p-4 mt-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-text-primary">
                  Mesa {selectedTable.number}
                </h3>
                <button
                  onClick={() => setSelectedTableId(null)}
                  className="bg-transparent border-none text-lg cursor-pointer text-text-secondary hover:text-text-primary"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-secondary">Capacidad:</span>
                  <span className="font-medium ml-1">
                    {selectedTable.capacity} personas
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Ubicación:</span>
                  <span className="font-medium ml-1">
                    {selectedTable.location === 'interior' ? 'Interior' :
                     selectedTable.location === 'terraza' ? 'Terraza' :
                     selectedTable.location === 'exterior' ? 'Exterior' : 'Privado'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Forma:</span>
                  <span className="font-medium ml-1">
                    {selectedTable.shape === 'square' ? 'Cuadrada' :
                     selectedTable.shape === 'rectangle' ? 'Rectangular' : 'Redonda'}
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary">Estado:</span>
                  <span className={`font-medium ml-1 ${
                    selectedTable.status === 'available' ? 'text-success' :
                           selectedTable.status === 'reserved' ? 'text-warning' :
                           selectedTable.status === 'occupied' ? 'text-danger' : 'text-text-secondary'
                  }`}>
                    {selectedTable.status === 'available' ? 'Disponible' :
                     selectedTable.status === 'reserved' ? 'Reservada' :
                     selectedTable.status === 'occupied' ? 'Ocupada' : 'Bloqueada'}
                  </span>
                </div>
              </div>
              
              {/* Reservas de la mesa */}
              {viewMode === 'view' && selectedTableReservations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-bold text-text-primary mb-2">
                    Reservas para {new Date(selectedDate).toLocaleDateString('es-ES')}:
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedTableReservations.map(reservation => (
                      <div key={reservation.id} className="p-2 bg-surface rounded text-xs">
                        <div className="font-medium">{reservation.customerName}</div>
                        <div>{reservation.time} - {reservation.guests} personas</div>
                        <div className="text-text-muted text-[11px]">
                          Estado: {reservation.status === 'confirmed' ? 'Confirmada' :
                                 reservation.status === 'pending' ? 'Pendiente' : reservation.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Botones de acción */}
              {viewMode === 'edit' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleDeleteTable(selectedTable.id)}
                    className="px-3 py-2 bg-danger text-white border-none rounded cursor-pointer text-xs font-medium hover:bg-danger-dark transition-colors"
                  >
                    Eliminar Mesa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}