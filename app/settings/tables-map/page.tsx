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
      <div className="page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '4px'
          }}>
            Mapa de Mesas
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Organiza visualmente tu restaurante y gestiona las reservas
          </p>
        </div>
        
        <div className="controls" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Selector de fecha para modo vista */}
          {viewMode === 'view' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#374151',
              }}
            />
          )}
          
          {/* Interruptor de modo vista/edición */}
          <div style={{ 
            display: 'flex',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            padding: '2px'
          }}>
            <button
              onClick={() => setViewMode('view')}
              style={{
                padding: '6px 12px',
                backgroundColor: viewMode === 'view' ? '#3b82f6' : 'transparent',
                color: viewMode === 'view' ? '#ffffff' : '#6b7280',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Ver Reservas
            </button>
            <button
              onClick={() => setViewMode('edit')}
              style={{
                padding: '6px 12px',
                backgroundColor: viewMode === 'edit' ? '#3b82f6' : 'transparent',
                color: viewMode === 'edit' ? '#ffffff' : '#6b7280',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Editar Mapa
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#991b1b',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
          fontSize: '16px',
          color: '#94a3b8',
        }}>
          Cargando mapa de mesas...
        </div>
      )}

      {/* Contenido principal */}
      {!loading && (
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
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
            <div style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              marginTop: '20px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                  Mesa {selectedTable.number}
                </h3>
                <button
                  onClick={() => setSelectedTableId(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '18px',
                    cursor: 'pointer',
                    color: '#6b7280',
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Capacidad:</span>
                  <span style={{ fontWeight: 'medium', marginLeft: '4px' }}>
                    {selectedTable.capacity} personas
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Ubicación:</span>
                  <span style={{ fontWeight: 'medium', marginLeft: '4px' }}>
                    {selectedTable.location === 'interior' ? 'Interior' : 
                     selectedTable.location === 'terraza' ? 'Terraza' : 
                     selectedTable.location === 'exterior' ? 'Exterior' : 'Privado'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Forma:</span>
                  <span style={{ fontWeight: 'medium', marginLeft: '4px' }}>
                    {selectedTable.shape === 'square' ? 'Cuadrada' : 
                     selectedTable.shape === 'rectangle' ? 'Rectangular' : 'Redonda'}
                  </span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Estado:</span>
                  <span style={{ 
                    fontWeight: 'medium', 
                    marginLeft: '4px',
                    color: selectedTable.status === 'available' ? '#059669' :
                           selectedTable.status === 'reserved' ? '#d97706' :
                           selectedTable.status === 'occupied' ? '#dc2626' : '#6b7280'
                  }}>
                    {selectedTable.status === 'available' ? 'Disponible' : 
                     selectedTable.status === 'reserved' ? 'Reservada' :
                     selectedTable.status === 'occupied' ? 'Ocupada' : 'Bloqueada'}
                  </span>
                </div>
              </div>
              
              {/* Reservas de la mesa */}
              {viewMode === 'view' && selectedTableReservations.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    Reservas para {new Date(selectedDate).toLocaleDateString('es-ES')}:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedTableReservations.map(reservation => (
                      <div key={reservation.id} style={{
                        padding: '8px',
                        backgroundColor: '#1e293b',
                        borderRadius: '4px',
                        fontSize: '12px',
                      }}>
                        <div style={{ fontWeight: 'medium' }}>{reservation.customerName}</div>
                        <div>{reservation.time} - {reservation.guests} personas</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px' }}>
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
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button
                    onClick={() => handleDeleteTable(selectedTable.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'medium',
                    }}
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