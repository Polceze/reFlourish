import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ScaleControl, Rectangle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Custom hook for rectangle drawing - MOVE THIS ABOVE MapComponent
const useRectangleDrawer = (onAreaSelect, onDrawingStart, selectedArea, onAnalysisComplete) => { // Add onAnalysisComplete here
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Clear drawing when selection is cleared from parent
  useEffect(() => {
    if (!selectedArea) {
      setStartPoint(null);
      setEndPoint(null);
      setIsDrawing(false);
    }
  }, [selectedArea]);

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
        
        console.log('🗺️ Area selected in MapComponent:', coordinates);
        
        // Send to backend with better logging
        console.log('📡 Sending analysis request to backend...');
        fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates }),
        })
          .then(response => {
            console.log('✅ Received response from backend, status:', response.status);
            return response.json();
          })
          .then(data => {
            console.log('📊 FULL Analysis results:', JSON.stringify(data, null, 2)); // Add this line
            console.log('📊 Analysis results:', data);
            if (data.success) {
              console.log('🎯 Suitability Score:', data.analysis?.overallScore);
              console.log('🏆 Priority Level:', data.analysis?.priorityLevel);
              console.log('🌍 Impact Projection:', data.impact);
              
              // Pass results back to parent component
              if (onAnalysisComplete) {
                onAnalysisComplete(data);
              }
            } else {
              console.error('❌ Analysis failed:', data.error);
            }
          })
          .catch(error => {
            console.error('💥 Network error:', error);
          });
        
        onAreaSelect(coordinates);
        
        // Reset drawing state
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
const RectangleDrawer = ({ onAreaSelect, onDrawingStart, selectedArea, onAnalysisComplete }) => { // Add prop here
  const { startPoint, endPoint, isDrawing } = useRectangleDrawer(
    onAreaSelect, 
    onDrawingStart, 
    selectedArea, 
    onAnalysisComplete // Pass it to the hook
  );

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

// Main MapComponent
const MapComponent = ({ onAreaSelect, onDrawingStart, selectedArea, onAnalysisComplete }) => {
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
          onAnalysisComplete={onAnalysisComplete}
        />
      </MapContainer>

      {/* Selection info panel */}
      {selectedArea && (
        <div className="selection-info">
          <h3>✅ Area Selected</h3>
          <p><strong>Center:</strong> {selectedArea.center.lat.toFixed(4)}, {selectedArea.center.lng.toFixed(4)}</p>
          <button className="clear-btn-small" onClick={() => {
            // Only clear the selection, don't trigger full analysis reset
            console.log('🗑️ Clearing selection from map');
            onAreaSelect(null);
          }}>
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;