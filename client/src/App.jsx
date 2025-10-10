import React, { useState } from 'react'
import MapComponent from './components/Map/MapComponent'

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAreaSelect = (coordinates) => {
    setSelectedArea(coordinates);
    setIsDrawing(false);
    setAnalysisResults(null); // Clear previous results
    setIsLoading(true);
  };

  const handleDrawingStart = () => {
    setIsDrawing(true);
  };

  const handleClearSelection = () => {
    setSelectedArea(null);
    setIsDrawing(false);
    setAnalysisResults(null);
    setIsLoading(false);
  };

  // Function to receive analysis results from MapComponent
  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setIsLoading(false);
  };

  // Get color based on priority level
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#1bb41bff'; // green
      case 'MEDIUM': return '#daab20ff'; // amber
      case 'LOW': return '#ec7716ff'; // orange
      case 'VERY_LOW': return '#D3D3D3'; // gray
      default: return '#D3D3D3';
    }
  };

  // Get emoji based on priority level
  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case 'HIGH': return '🟢'; 
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟠'; 
      case 'VERY_LOW': return '⚪';
      default: return '⚪';
    }
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
          {/* Unified Instructions Section - Collapsible when results are shown */}
          {(!analysisResults && !isLoading) && (
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
                <span>
                  {isLoading ? '🔍 Analyzing...' : 
                  isDrawing ? 'Drawing in progress...' : 'Ready to draw'}
                </span>
              </div>
            </div>
          )}

          {/* Mini instructions when results are shown */}
          {analysisResults && (
            <div className="mini-instructions">
              <div className="mini-card">
                <span className="mini-icon">💡</span>
                <span>Draw a new area to analyze another location</span>
                <button className="mini-clear-btn" onClick={handleClearSelection}>
                  Start Over
                </button>
              </div>
            </div>
          )}
          {/* Analysis Results */}
          {analysisResults ? (
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <h3>Analysis Results</h3>
                <button className="clear-btn" onClick={handleClearSelection}>
                  Clear
                </button>
              </div>
              
              <div className="analysis-content">
                {/* Greening Potential Score */}
                <div className="score-section">
                  <h4>Greening Potential</h4>
                  <div className="score-display">
                    <div className="score-circle">
                      <span className="score-value">
                        {(analysisResults.analysis.overallScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="score-info">
                      <div className="potential-badge" style={{ 
                        backgroundColor: getPriorityColor(analysisResults.analysis.priorityLevel) 
                      }}>
                        {getPriorityEmoji(analysisResults.analysis.priorityLevel)} 
                        {analysisResults.analysis.priorityLevel.replace('PRIORITY', 'POTENTIAL')}
                      </div>
                      <p>Higher scores indicate better conditions for vegetation growth</p>
                    </div>
                  </div>
                </div>

                {/* Environmental Factors */}
                <div className="factors-section">
                  <h4>Environmental Factors</h4>
                  <div className="factors-grid">
                    <div className="factor-item">
                      <span className="factor-label">Vegetation</span>
                      <div className="factor-bar">
                        <div 
                          className="factor-fill" 
                          style={{ width: `${analysisResults.analysis.detailedScores[0].factors.vegetation * 100}%` }}
                        ></div>
                      </div>
                      <span className="factor-value">
                        {(analysisResults.analysis.detailedScores[0].factors.vegetation * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-item">
                      <span className="factor-label">Soil Quality</span>
                      <div className="factor-bar">
                        <div 
                          className="factor-fill" 
                          style={{ width: `${analysisResults.analysis.detailedScores[0].factors.soil * 100}%` }}
                        ></div>
                      </div>
                      <span className="factor-value">
                        {(analysisResults.analysis.detailedScores[0].factors.soil * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-item">
                      <span className="factor-label">Rainfall</span>
                      <div className="factor-bar">
                        <div 
                          className="factor-fill" 
                          style={{ width: `${analysisResults.analysis.detailedScores[0].factors.rainfall * 100}%` }}
                        ></div>
                      </div>
                      <span className="factor-value">
                        {(analysisResults.analysis.detailedScores[0].factors.rainfall * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-item">
                      <span className="factor-label">Biodiversity</span>
                      <div className="factor-bar">
                        <div 
                          className="factor-fill" 
                          style={{ width: `${analysisResults.analysis.detailedScores[0].factors.biodiversity * 100}%` }}
                        ></div>
                      </div>
                      <span className="factor-value">
                        {(analysisResults.analysis.detailedScores[0].factors.biodiversity * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Impact Projection */}
                <div className="impact-section">
                  <h4>Potential Impact</h4>
                  <div className="impact-grid">
                    <div className="impact-item">
                      <span className="impact-icon">🌿</span>
                      <div className="impact-info">
                        <span className="impact-value">
                          {analysisResults.impact.co2Sequestration.toFixed(0)} tons
                        </span>
                        <span className="impact-label">CO₂ Sequestration / year</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">🦋</span>
                      <div className="impact-info">
                        <span className="impact-value">
                          {analysisResults.impact.biodiversityGain.toFixed(1)}
                        </span>
                        <span className="impact-label">Biodiversity Index Gain</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">💧</span>
                      <div className="impact-info">
                        <span className="impact-value">
                          {analysisResults.impact.waterRetention.toFixed(0)} m³
                        </span>
                        <span className="impact-label">Water Retention / year</span>
                      </div>
                    </div>
                    <div className="impact-item">
                      <span className="impact-icon">🌱</span>
                      <div className="impact-info">
                        <span className="impact-value">
                          {analysisResults.impact.soilPreservation.toFixed(0)} tons
                        </span>
                        <span className="impact-label">Soil Preservation / year</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedArea ? (
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">⏳</div>
                <h3>Analyzing Greening Potential</h3>
              </div>
              <div className="analysis-content">
                <div className="loading-section">
                  <div className="loading-spinner"></div>
                  <p>Assessing environmental conditions...</p>
                  <div className="coordinate-section">
                    <h4>Selected Location</h4>
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
                </div>
              </div>
            </div>
          ) : (
            <div className="placeholder-card">
              <div className="placeholder-icon">🗺️</div>
              <h3>Select an Area</h3>
              <p>Draw a rectangle to analyze greening potential and ecosystem benefits</p>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapComponent 
          onAreaSelect={handleAreaSelect} 
          onDrawingStart={handleDrawingStart}
          selectedArea={selectedArea}
          onAnalysisComplete={handleAnalysisComplete}
        />
      </div>
    </div>
  )
}

export default App