import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, Rectangle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Custom hook for rectangle drawing
const useRectangleDrawer = (onAreaSelect, onDrawingStart, selectedArea) => {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const map = useMap();

  // Clear drawing when selection is cleared from parent
  useEffect(() => {
    if (!selectedArea) {
      setStartPoint(null);
      setEndPoint(null);
      setIsDrawing(false);
      
      // Remove any existing rectangles from the map
      map.eachLayer((layer) => {
        // Check if layer is a Rectangle by its feature instead of using L.Rectangle
        // eslint-disable-next-line no-unsafe-optional-chaining
        if (layer instanceof map.options.layers?.constructor || 
            layer?.feature?.type === 'Rectangle' ||
            layer?.options?.className === 'leaflet-interactive') {
          // More specific check - look for rectangles by their style or properties
          if (layer.options?.color === '#10b981' || layer.options?.fillColor === '#d1fae5') {
            map.removeLayer(layer);
          }
        }
      });
    }
  }, [selectedArea, map]);

  useMapEvents({
    click: (e) => {
      if (!isDrawing) {
        // Start drawing
        setStartPoint(e.latlng);
        setIsDrawing(true);
        onDrawingStart();
      } else {
        // Finish drawing
        setEndPoint(e.latlng);
        setIsDrawing(false);
        
        // Calculate bounds
        const bounds = [
          [Math.min(startPoint.lat, e.latlng.lat), Math.min(startPoint.lng, e.latlng.lng)],
          [Math.max(startPoint.lat, e.latlng.lat), Math.max(startPoint.lng, e.latlng.lng)]
        ];
        
        const coordinates = {
          northEast: { lat: bounds[1][0], lng: bounds[1][1] },
          southWest: { lat: bounds[0][0], lng: bounds[0][1] },
          center: { 
            lat: (bounds[0][0] + bounds[1][0]) / 2, 
            lng: (bounds[0][1] + bounds[1][1]) / 2 
          },
          bounds: bounds
        };
        
        onAreaSelect(coordinates);
        
        // Reset drawing state (keep the final rectangle visible)
        setStartPoint(null);
        setEndPoint(null);
      }
    },
    mousemove: (e) => {
      if (isDrawing && startPoint) {
        setEndPoint(e.latlng);
      }
    }
  });

  return { startPoint, endPoint, isDrawing };
};

// Rectangle drawing component
const RectangleDrawer = ({ onAreaSelect, onDrawingStart, selectedArea }) => {
  const { startPoint, endPoint, isDrawing } = useRectangleDrawer(onAreaSelect, onDrawingStart, selectedArea);

  // Show temporary rectangle while drawing
  if (isDrawing && startPoint && endPoint) {
    const bounds = [
      [startPoint.lat, startPoint.lng],
      [endPoint.lat, endPoint.lng]
    ];

    return (
      <Rectangle
        key="drawing-rectangle"
        bounds={bounds}
        pathOptions={{
          color: '#f59e0b',
          weight: 2,
          fillColor: '#fef3c7',
          fillOpacity: 0.2
        }}
      />
    );
  }

  // Show permanent rectangle after selection
  if (selectedArea && !isDrawing) {
    return (
      <Rectangle
        key="selected-rectangle"
        bounds={selectedArea.bounds}
        pathOptions={{
          color: '#10b981',
          weight: 2,
          fillColor: '#d1fae5',
          fillOpacity: 0.2
        }}
      />
    );
  }

  return null;
};

const MapComponent = ({ onAreaSelect, onDrawingStart, selectedArea }) => {
  const center = [40.7128, -74.006];

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ScaleControl position="bottomleft" />
        <RectangleDrawer 
          onAreaSelect={onAreaSelect} 
          onDrawingStart={onDrawingStart}
          selectedArea={selectedArea}
        />
      </MapContainer>

      {/* Selection info panel */}
      {selectedArea && (
        <div className="selection-info">
          <h3>✅ Area Selected</h3>
          <p><strong>Center:</strong> {selectedArea.center.lat.toFixed(4)}, {selectedArea.center.lng.toFixed(4)}</p>
          <button className="clear-btn-small" onClick={() => onAreaSelect(null)}>
            × Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;