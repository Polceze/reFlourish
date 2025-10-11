import React, { useState } from 'react'
import MapComponent from './components/Map/MapComponent'

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAreaSelect = (coordinates) => {
    if (coordinates === null) {
      // Clear selection only - keep instructions visible
      console.log('🧹 Clearing selection, keeping instructions');
      setSelectedArea(null);
      setAnalysisResults(null);
      setIsLoading(false);
      // Don't reset isDrawing - let instructions stay visible
    } else {
      // New area selected - start analysis
      setSelectedArea(coordinates);
      setIsDrawing(false);
      setAnalysisResults(null);
      setIsLoading(true);
    }
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
                  Clear Selection
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
                {/* <button className="clear-btn" onClick={handleClearSelection}>
                  Clear
                </button> */}
              </div>
              
              <div className="analysis-content">
                {/* Selected Area Coordinates */}
                <div className="coordinate-section">
                  <h4>Selected Area</h4>
                  <div className="coordinate-grid">
                    <div className="coord-item">
                      <label>Latitude</label>
                      <span>{analysisResults.area.center.lat.toFixed(4)}</span>
                    </div>
                    <div className="coord-item">
                      <label>Longitude</label>
                      <span>{analysisResults.area.center.lng.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="coord-item">
                    <label>Area Size</label>
                    <span>{analysisResults.analysis.areaSize.toFixed(2)} km²</span>
                  </div>
                  <div className="coord-item">
                    <label>Data Sources</label>
                    <span style={{color: '#10b981', fontWeight: '600'}}>Real Satellite + Weather</span>
                  </div>
                </div>

                {/* Forestation Potential Score - Condensed */}
                <div className="score-section">
                  <h4>Forestation Potential</h4>
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

                {/* View Details Button */}
                <div className="details-action">
                  <button className="details-btn" onClick={() => setIsModalOpen(true)}>
                    📈 View Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : selectedArea ? (
            <div className="analysis-card">
              <div className="card-header">
                <div className="card-icon">⏳</div>
                <h3>Analyzing Forestation Potential</h3>
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
              <p>Draw a rectangle to analyze Forestation potential and ecosystem benefits</p>
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
      {/* Detailed Analysis Modal */}
      {isModalOpen && analysisResults && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detailed Analysis</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {/* Environmental Factors */}
              <div className="modal-section">
                <h3>Dashboard Summary</h3>
                <div className="dashboard-summary">
                  <div className="summary-item">
                    <span className="summary-label">Area Size</span>
                    <span className="summary-value">{analysisResults.analysis.areaSize?.toFixed(2) || '0.00'} km²</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Forestation potential Score</span>
                    <span className="summary-value">{((analysisResults.analysis.overallScore || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Grade</span>
                    <span className="summary-value">                    
                      <div className="potential-badge" style={{ 
                        backgroundColor: getPriorityColor(analysisResults.analysis.priorityLevel) 
                      }}>
                        {getPriorityEmoji(analysisResults.analysis.priorityLevel)} 
                        {analysisResults.analysis.priorityLevel.replace('PRIORITY', 'POTENTIAL')}
                      </div>
                    </span>
                    

                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Data Confidence</span>
                    <span className="summary-value">🟢 High</span>
                  </div>
                </div>
                <h3>Environmental Factors</h3>
                <div className="factors-grid-detailed">
                  <div className="factor-item-detailed">
                    <div className="factor-header">
                      <span className="factor-label-detailed">Existing Vegetation Health</span>
                      <span className="factor-value-detailed">
                        {(analysisResults.analysis.detailedScores[0].factors.vegetation * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-bar-detailed">
                      <div 
                        className="factor-fill-detailed" 
                        style={{ width: `${analysisResults.analysis.detailedScores[0].factors.vegetation * 100}%` }}
                      ></div>
                    </div>
                    <p className="factor-description">
                      Current vegetation density and health indicators
                    </p>
                  </div>
                  
                  <div className="factor-item-detailed">
                    <div className="factor-header">
                      <span className="factor-label-detailed">Soil Quality</span>
                      <span className="factor-value-detailed">
                        {(analysisResults.analysis.detailedScores[0].factors.soil * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-bar-detailed">
                      <div 
                        className="factor-fill-detailed" 
                        style={{ width: `${analysisResults.analysis.detailedScores[0].factors.soil * 100}%` }}
                      ></div>
                    </div>
                    <p className="factor-description">
                      Soil composition and nutrient availability
                    </p>
                  </div>
                  
                  <div className="factor-item-detailed">
                    <div className="factor-header">
                      <span className="factor-label-detailed">Rainfall Pattern</span>
                      <span className="factor-value-detailed">
                        {(analysisResults.analysis.detailedScores[0].factors.rainfall * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-bar-detailed">
                      <div 
                        className="factor-fill-detailed" 
                        style={{ width: `${analysisResults.analysis.detailedScores[0].factors.rainfall * 100}%` }}
                      ></div>
                    </div>
                    <p className="factor-description">
                      Historical precipitation and water availability
                    </p>
                  </div>
                  
                  <div className="factor-item-detailed">
                    <div className="factor-header">
                      <span className="factor-label-detailed">Biodiversity Index</span>
                      <span className="factor-value-detailed">
                        {(analysisResults.analysis.detailedScores[0].factors.biodiversity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="factor-bar-detailed">
                      <div 
                        className="factor-fill-detailed" 
                        style={{ width: `${analysisResults.analysis.detailedScores[0].factors.biodiversity * 100}%` }}
                      ></div>
                    </div>
                    <p className="factor-description">
                      Species diversity and ecosystem complexity
                    </p>
                  </div>
                </div>
              </div>

              {/* Impact Projection */}
              <div className="modal-section">
                <h3>Projected Annual Environmental Impact</h3>
                <div className="impact-grid-detailed">
                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">🌿</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        {analysisResults.impact.co2Sequestration?.toLocaleString() || '0'} tons
                      </div>
                      <div className="impact-label-detailed">CO₂ Sequestration</div>
                      <div className="impact-description">
                        Based on IPCC temperate forest sequestration rates (2.5-7.5 tons/ha/year)
                      </div>
                    </div>
                  </div>
                  
                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">💧</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        {analysisResults.impact.waterRetention?.toLocaleString() || '0'} m³
                      </div>
                      <div className="impact-label-detailed">Water Retention</div>
                      <div className="impact-description">
                        Natural water filtration and groundwater recharge (500-2000 m³/ha/year)
                      </div>
                    </div>
                  </div>
                  
                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">🦋</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        +{analysisResults.impact.biodiversityGain?.toFixed(1) || '0'} pts
                      </div>
                      <div className="impact-label-detailed">Biodiversity Index</div>
                      <div className="impact-description">
                        Habitat quality improvement on 0-100 scale (ecological integrity)
                      </div>
                    </div>
                  </div>
                  
                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">🌱</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        {analysisResults.impact.soilPreservation?.toLocaleString() || '0'} tons
                      </div>
                      <div className="impact-label-detailed">Soil Preservation</div>
                      <div className="impact-description">
                        FAO studies show vegetation reduces soil erosion by 1-5 tons/ha/year
                      </div>
                    </div>
                  </div>

                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">🌬️</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        {analysisResults.impact.airQualityImprovement?.toLocaleString() || '0'} kg
                      </div>
                      <div className="impact-label-detailed">Air Quality</div>
                      <div className="impact-description">
                        Pollutants removed annually (EPA: 0.5-2 kg/ha/year)
                      </div>
                    </div>
                  </div>

                  <div className="impact-item-detailed">
                    <div className="impact-icon-detailed">💰</div>
                    <div className="impact-content-detailed">
                      <div className="impact-value-detailed">
                        ${analysisResults.impact.economicValue?.toLocaleString() || '0'}
                      </div>
                      <div className="impact-label-detailed">Economic Value</div>
                      <div className="impact-description">
                        Ecosystem services (TEEB: $500-5000/ha/year)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="modal-section">
                <h3>Data Sources & Methodology</h3>
                <div className="data-sources">
                  <div className="data-source-item real-data">
                    <strong>Vegetation Health:</strong> OpenEO + Sentinel-2 Satellite Imagery
                  </div>
                  <div className="data-source-item real-data">
                    <strong>Soil Quality:</strong> OpenEO Land Cover Classification
                  </div>
                  <div className="data-source-item real-data">
                    <strong>Rainfall Data:</strong> Open-Meteo Historical Weather API
                  </div>
                  <div className="data-source-item real-data">
                    <strong>Biodiversity:</strong> OpenEO Habitat Heterogeneity Analysis
                  </div>
                  <div className="data-source-item">
                    <strong>Impact Calculations:</strong> Peer-reviewed ecological models
                  </div>
                </div>
                <div className="data-credibility-note">
                  ✅ <strong>Real Satellite & Weather Data:</strong> This analysis uses current environmental data from open-source APIs
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="modal-action-btn" onClick={() => setIsModalOpen(false)}>
                Close Detailed View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App