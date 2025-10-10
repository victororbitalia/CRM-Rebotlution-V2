'use client';

import { useState } from 'react';
import { TableFormData, ZoneFormData, TableSize, ZoneDimensions } from '@/types/map';

interface MapEditToolsProps {
  onAddTable: (table: TableFormData) => void;
  onAddZone: (zone: ZoneFormData) => void;
  tablesCount: number;
  zonesCount: number;
}

export default function MapEditTools({ 
  onAddTable, 
  onAddZone, 
  tablesCount, 
  zonesCount 
}: MapEditToolsProps) {
  const [activeTab, setActiveTab] = useState<'table' | 'zone'>('table');
  const [showForm, setShowForm] = useState(false);

  // Estado para el formulario de mesa
  const [tableForm, setTableForm] = useState<TableFormData>({
    number: (tablesCount + 1).toString(),
    capacity: 2,
    location: 'interior',
    shape: 'square',
    size: { width: 60, height: 60 },
    position: { x: 50, y: 50 },
  });

  // Estado para el formulario de zona
  const [zoneForm, setZoneForm] = useState<ZoneFormData>({
    name: '',
    type: 'interior',
    dimensions: { width: 300, height: 200 },
    position: { x: 50, y: 50 },
    color: '#f3f4f6',
  });

  // Manejar el envío del formulario de mesa
  const handleTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTable(tableForm);
    setTableForm({
      ...tableForm,
      number: (tablesCount + 1).toString(),
      position: { 
        x: Math.random() * 200 + 50, 
        y: Math.random() * 200 + 50 
      },
    });
    setShowForm(false);
  };

  // Manejar el envío del formulario de zona
  const handleZoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddZone(zoneForm);
    setZoneForm({
      ...zoneForm,
      name: '',
      position: { 
        x: Math.random() * 100 + 50, 
        y: Math.random() * 100 + 50 
      },
    });
    setShowForm(false);
  };

  // Colores predefinidos para zonas
  const zoneColors = [
    { name: 'Gris claro', value: '#f3f4f6' },
    { name: 'Azul claro', value: '#dbeafe' },
    { name: 'Verde claro', value: '#d1fae5' },
    { name: 'Amarillo claro', value: '#fef3c7' },
    { name: 'Rosa claro', value: '#fce7f3' },
    { name: 'Naranja claro', value: '#fed7aa' },
  ];

  return (
    <div className="map-edit-tools" style={{ 
      width: '100%',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <div className="tools-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
          Herramientas de Edición
        </h2>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Mesas: {tablesCount} | Zonas: {zonesCount}
        </div>
      </div>

      {/* Pestañas */}
      <div className="tabs" style={{ 
        display: 'flex', 
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('table')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: activeTab === 'table' ? '#3b82f6' : 'transparent',
            color: activeTab === 'table' ? '#ffffff' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'medium',
          }}
        >
          Añadir Mesa
        </button>
        <button
          onClick={() => setActiveTab('zone')}
          style={{
            flex: 1,
            padding: '8px 16px',
            backgroundColor: activeTab === 'zone' ? '#3b82f6' : 'transparent',
            color: activeTab === 'zone' ? '#ffffff' : '#6b7280',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'medium',
          }}
        >
          Añadir Zona
        </button>
      </div>

      {/* Botón para mostrar formulario */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'medium',
            marginBottom: '16px',
          }}
        >
          {activeTab === 'table' ? 'Añadir Nueva Mesa' : 'Añadir Nueva Zona'}
        </button>
      )}

      {/* Formulario de mesa */}
      {showForm && activeTab === 'table' && (
        <form onSubmit={handleTableSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Número de Mesa
            </label>
            <input
              type="number"
              value={tableForm.number}
              onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              min="1"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Capacidad
            </label>
            <input
              type="number"
              value={tableForm.capacity}
              onChange={(e) => setTableForm({ ...tableForm, capacity: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              min="1"
              max="20"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Ubicación
            </label>
            <select
              value={tableForm.location}
              onChange={(e) => setTableForm({ ...tableForm, location: e.target.value as any })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              required
            >
              <option value="interior">Interior</option>
              <option value="terraza">Terraza</option>
              <option value="exterior">Exterior</option>
              <option value="privado">Privado</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Forma
            </label>
            <select
              value={tableForm.shape}
              onChange={(e) => setTableForm({ ...tableForm, shape: e.target.value as any })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              required
            >
              <option value="square">Cuadrada</option>
              <option value="rectangle">Rectangular</option>
              <option value="circle">Redonda</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Tamaño (Ancho x Alto)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={tableForm.size.width}
                onChange={(e) => setTableForm({ 
                  ...tableForm, 
                  size: { ...tableForm.size, width: parseInt(e.target.value) } 
                })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                min="40"
                max="120"
                required
              />
              <input
                type="number"
                value={tableForm.size.height}
                onChange={(e) => setTableForm({ 
                  ...tableForm, 
                  size: { ...tableForm.size, height: parseInt(e.target.value) } 
                })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                min="40"
                max="120"
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Añadir Mesa
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Formulario de zona */}
      {showForm && activeTab === 'zone' && (
        <form onSubmit={handleZoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Nombre de la Zona
            </label>
            <input
              type="text"
              value={zoneForm.name}
              onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              placeholder="Ej: Terraza Principal"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Tipo de Zona
            </label>
            <select
              value={zoneForm.type}
              onChange={(e) => setZoneForm({ ...zoneForm, type: e.target.value as any })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              required
            >
              <option value="interior">Interior</option>
              <option value="terraza">Terraza</option>
              <option value="exterior">Exterior</option>
              <option value="privado">Privado</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Dimensiones (Ancho x Alto)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={zoneForm.dimensions.width}
                onChange={(e) => setZoneForm({ 
                  ...zoneForm, 
                  dimensions: { ...zoneForm.dimensions, width: parseInt(e.target.value) } 
                })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                min="200"
                max="600"
                required
              />
              <input
                type="number"
                value={zoneForm.dimensions.height}
                onChange={(e) => setZoneForm({ 
                  ...zoneForm, 
                  dimensions: { ...zoneForm.dimensions, height: parseInt(e.target.value) } 
                })}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
                min="200"
                max="600"
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '4px' }}>
              Color de Fondo
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {zoneColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setZoneForm({ ...zoneForm, color: color.value })}
                  style={{
                    padding: '8px',
                    backgroundColor: color.value,
                    border: zoneForm.color === color.value ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: zoneForm.color === color.value ? 'bold' : 'normal',
                  }}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Añadir Zona
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'medium',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Instrucciones */}
      {!showForm && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #bae6fd', 
          borderRadius: '6px',
          fontSize: '14px',
          color: '#0c4a6e'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Instrucciones:</p>
          <ul style={{ paddingLeft: '20px', margin: '0' }}>
            <li>Añade zonas para organizar tu restaurante</li>
            <li>Añade mesas y arrástralas a las zonas</li>
            <li>Las mesas sin zona aparecerán en la esquina inferior izquierda</li>
            <li>Las mesas reservadas se mostrarán en amarillo</li>
            <li>Las mesas ocupadas se mostrarán en rojo</li>
          </ul>
        </div>
      )}
    </div>
  );
}