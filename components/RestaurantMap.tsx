'use client';

import { useState, useRef, useEffect } from 'react';
import { Table, Zone, TablePosition, TableSize } from '@/types/map';

interface RestaurantMapProps {
  zones: Zone[];
  tables: Table[];
  onTableUpdate?: (tableId: string, updates: Partial<Table>) => void;
  onTableSelect?: (tableId: string | null) => void;
  selectedTableId?: string | null;
  editMode?: boolean;
  date?: string;
}

export default function RestaurantMap({ 
  zones, 
  tables, 
  onTableUpdate, 
  onTableSelect,
  selectedTableId,
  editMode = false,
  date
}: RestaurantMapProps) {
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<TablePosition>({ x: 0, y: 0 });
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Función para obtener el color de estado de la mesa
  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4ade80'; // verde
      case 'reserved': return '#facc15';  // amarillo
      case 'occupied': return '#f87171';  // rojo
      case 'blocked': return '#94a3b8';   // gris
      default: return '#e5e7eb';          // gris claro
    }
  };

  // Función para renderizar la forma de la mesa
  const renderTableShape = (table: Table) => {
    const { size = { width: 60, height: 60 }, shape, number, capacity } = table;
    const statusColor = getTableStatusColor(table.status);
    const isSelected = selectedTableId === table.id;

    const baseStyle = {
      width: `${size.width}px`,
      height: `${size.height}px`,
      backgroundColor: statusColor,
      border: isSelected ? '3px solid #3b82f6' : '1px solid #374151',
      borderRadius: shape === 'circle' ? '50%' : shape === 'square' ? '8px' : '8px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: editMode ? 'move' : 'pointer',
      position: 'absolute' as const,
      left: `${table.position?.x || 0}px`,
      top: `${table.position?.y || 0}px`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      transform: draggedTable === table.id ? 'scale(1.05)' : 'scale(1)',
      boxShadow: draggedTable === table.id ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      zIndex: draggedTable === table.id ? 1000 : 10,
    };

    return (
      <div
        style={baseStyle}
        draggable={editMode}
        onDragStart={(e) => handleTableDragStart(e, table)}
        onDragEnd={handleTableDragEnd}
        onClick={() => !editMode && onTableSelect && onTableSelect(table.id)}
        onMouseEnter={() => !editMode && setHoveredZone(table.zoneId || null)}
        onMouseLeave={() => !editMode && setHoveredZone(null)}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}>
          {number}
        </span>
        <span style={{ fontSize: '10px', color: '#374151' }}>
          {capacity}p
        </span>
        {table.status === 'reserved' && (
          <span style={{ fontSize: '8px', color: '#111827', marginTop: '2px' }}>
            Reservada
          </span>
        )}
      </div>
    );
  };

  // Manejar el inicio del arrastre de una mesa
  const handleTableDragStart = (e: React.DragEvent, table: Table) => {
    setDraggedTable(table.id);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    
    // Crear una imagen fantasma para el arrastre
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.5';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
    
    // Eliminar la imagen fantasma después de un momento
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Manejar el final del arrastre de una mesa
  const handleTableDragEnd = (e: React.DragEvent) => {
    if (!draggedTable || !mapRef.current) return;
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - mapRect.left - dragOffset.x;
    const y = e.clientY - mapRect.top - dragOffset.y;
    
    // Encontrar en qué zona se soltó la mesa
    const droppedZone = zones.find(zone => {
      const zoneX = zone.position.x;
      const zoneY = zone.position.y;
      const zoneWidth = zone.dimensions.width;
      const zoneHeight = zone.dimensions.height;
      
      return x >= zoneX && x <= zoneX + zoneWidth && 
             y >= zoneY && y <= zoneY + zoneHeight;
    });
    
    // Actualizar la posición y zona de la mesa
    if (onTableUpdate) {
      onTableUpdate(draggedTable, {
        position: { x, y },
        zoneId: droppedZone?.id,
        location: droppedZone?.type || 'interior',
      });
    }
    
    setDraggedTable(null);
  };

  // Manejar el arrastre sobre una zona
  const handleZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Manejar el soltar en una zona
  const handleZoneDrop = (e: React.DragEvent, zone: Zone) => {
    e.preventDefault();
    
    if (!draggedTable || !mapRef.current) return;
    
    const mapRect = mapRef.current.getBoundingClientRect();
    const zoneRect = e.currentTarget.getBoundingClientRect();
    
    const x = e.clientX - mapRect.left - dragOffset.x;
    const y = e.clientY - mapRect.top - dragOffset.y;
    
    // Actualizar la posición y zona de la mesa
    if (onTableUpdate) {
      onTableUpdate(draggedTable, {
        position: { x, y },
        zoneId: zone.id,
        location: zone.type,
      });
    }
    
    setDraggedTable(null);
  };

  // Renderizar una zona
  const renderZone = (zone: Zone) => (
    <div
      key={zone.id}
      style={{
        position: 'absolute',
        left: `${zone.position.x}px`,
        top: `${zone.position.y}px`,
        width: `${zone.dimensions.width}px`,
        height: `${zone.dimensions.height}px`,
        backgroundColor: zone.color,
        border: hoveredZone === zone.id ? '2px dashed #3b82f6' : '1px solid #d1d5db',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px',
        boxSizing: 'border-box',
      }}
      onDragOver={handleZoneDragOver}
      onDrop={(e) => handleZoneDrop(e, zone)}
      onMouseEnter={() => setHoveredZone(zone.id)}
      onMouseLeave={() => setHoveredZone(null)}
    >
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 'bold', 
        color: '#374151',
        marginBottom: '4px',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '4px'
      }}>
        {zone.name}
      </div>
      <div style={{ 
        fontSize: '12px', 
        color: '#6b7280',
        marginBottom: '8px'
      }}>
        {zone.type === 'interior' ? 'Interior' : 
         zone.type === 'terraza' ? 'Terraza' : 
         zone.type === 'exterior' ? 'Exterior' : 'Privado'}
      </div>
      
      {/* Renderizar mesas de esta zona */}
      {tables
        .filter(table => table.zoneId === zone.id)
        .map(table => renderTableShape(table))}
    </div>
  );

  // Renderizar mesas sin zona asignada
  const renderUnassignedTables = () => (
    <div
      style={{
        position: 'absolute',
        left: '10px',
        bottom: '10px',
        backgroundColor: '#fef3c7',
        border: '1px dashed #f59e0b',
        borderRadius: '8px',
        padding: '8px',
        maxWidth: '200px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <div style={{ 
        fontSize: '12px', 
        fontWeight: 'bold', 
        color: '#92400e',
        marginBottom: '4px'
      }}>
        Mesas sin asignar
      </div>
      <div style={{ fontSize: '10px', color: '#78350f', marginBottom: '8px' }}>
        Arrastra estas mesas a una zona
      </div>
      
      {tables
        .filter(table => !table.zoneId)
        .map(table => renderTableShape(table))}
    </div>
  );

  return (
    <div className="restaurant-map-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div 
        ref={mapRef}
        className="map-canvas" 
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Renderizar zonas */}
        {zones.map(zone => renderZone(zone))}
        
        {/* Renderizar mesas sin zona asignada */}
        {editMode && tables.some(table => !table.zoneId) && renderUnassignedTables()}
        
        {/* Indicador de modo edición */}
        {editMode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}>
            Modo Edición
          </div>
        )}
        
        {/* Información de la fecha seleccionada */}
        {date && !editMode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}>
            {new Date(date).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        )}
      </div>
    </div>
  );
}