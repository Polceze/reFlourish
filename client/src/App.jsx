import React, { useState } from 'react'
import MapComponent from './components/Map/MapComponent'

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleAreaSelect = (coordinates) => {
    setSelectedArea(coordinates);
    setIsDrawing(false);
  };

  const handleDrawingStart = () => {
    setIsDrawing(true);
  };

  const handleClearSelection = () => {
    setSelectedArea(null);
    setIsDrawing(false);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <div className="header-content">
            <div className="logo">
              🌱
            </div>
            <div>
              <h1>ReFlourish</h1>
              <p className="subtitle">Ecosystem Restoration Platform</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="sidebar-content">
          {/* Unified Instructions Section */}
          <div className="instructions-card">
            <div className="card-header">
              <div className="card-icon">🎯</div>
              <h3>How to Use</h3>
            </div>
            
            <div className="steps-container">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Start Drawing</strong>
                  <p>Click anywhere on the map to begin</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Adjust Size</strong>
                  <p>Move your mouse to resize the rectangle</p>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Complete Selection</strong>
                  <p>Click again to finalize the area</p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={`status-indicator ${isDrawing ? 'drawing' : 'ready'}`}>
              <div className="status-dot"></div>
              <span>{isDrawing ? 'Drawing in progress...' : 'Ready to draw'}</span>
            </div>
          </div>

          {/* Analysis Results or Placeholder */}
          {selectedArea ? (
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">✅</div>
                <h3>Area Selected</h3>
                <button className="clear-btn" onClick={handleClearSelection}>
                  Clear
                </button>
              </div>
              
              <div className="analysis-content">
                <div className="coordinate-section">
                  <h4>Location Details</h4>
                  <div className="coordinate-grid">
                    <div className="coord-item">
                      <label>Latitude</label>
                      <span>{selectedArea.center.lat.toFixed(4)}</span>
                    </div>
                    <div className="coord-item">
                      <label>Longitude</label>
                      <span>{selectedArea.center.lng.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="next-steps">
                  <h4>Next Steps</h4>
                  <p>This area is ready for ecological analysis in Phase 2.</p>
                  <ul>
                    <li>Vegetation health scoring</li>
                    <li>Soil quality assessment</li>
                    <li>Restoration priority calculation</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-card">
              <div className="placeholder-icon">🗺️</div>
              <h3>Select an Area</h3>
              <p>Draw a rectangle on the map to analyze ecosystem restoration potential</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-text">
            <p>ReFlourish MVP • Phase 1 Complete</p>
            <p>Map ✓ Drawing ✓ Analysis Ready ✓</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapComponent 
          onAreaSelect={handleAreaSelect} 
          onDrawingStart={handleDrawingStart}
          selectedArea={selectedArea}
        />
      </div>
    </div>
  )
}

export default App