import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = ({ isOpen, onClose }) => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const { user, token } = useAuth();

    // Move fetchAnalysisHistory inside useCallback
  const fetchAnalysisHistory = useCallback(async () => {
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/analyses/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      console.error('Failed to fetch analysis history:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen && user) {
      fetchAnalysisHistory();
    }
  }, [isOpen, user, fetchAnalysisHistory]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content dashboard-content" onClick={(e) => e.stopPropagation()}>
        <div className="dashboard-header">
          <h2>My Analysis History</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="dashboard-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your analyses...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>No Analyses Yet</h3>
              <p>Your analysis history will appear here once you start analyzing areas.</p>
            </div>
          ) : (
            <div className="analyses-list">
              {analyses.map((analysis) => (
                <div 
                  key={analysis.id} 
                  className="analysis-item"
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="analysis-header">
                    <div className="analysis-score">
                      {((analysis.overallScore || 0) * 100).toFixed(0)}%
                    </div>
                    <div className="analysis-info">
                      <div className="analysis-location">
                        latitude: {analysis.coordinates?.center?.lat.toFixed(4)}, longitude: {analysis.coordinates?.center?.lng.toFixed(4)}
                      </div>
                      <div className="analysis-date">
                        Timestamp: {formatDate(analysis.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="analysis-preview">
                    <span className="potential-badge-small">
                      {analysis.priorityLevel?.replace('PRIORITY', 'POTENTIAL')}
                    </span>
                    <span className="area-size">
                      Area size: {analysis.areaSize?.toFixed(2)} km²
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedAnalysis && (
          <div className="analysis-detail-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Analysis Details</h3>
                <button onClick={() => setSelectedAnalysis(null)}>×</button>
              </div>
              <div className="analysis-detail-content">
                <div className="detail-section">
                  <h4>Location</h4>
                  <p>Lat: {selectedAnalysis.coordinates?.center?.lat.toFixed(4)}</p>
                  <p>Lng: {selectedAnalysis.coordinates?.center?.lng.toFixed(4)}</p>
                  <p>Area: {selectedAnalysis.areaSize?.toFixed(2)} km²</p>
                </div>
                <div className="detail-section">
                  <h4>Results</h4>
                  <p>Greening Potential: {((selectedAnalysis.overallScore || 0) * 100).toFixed(0)}%</p>
                  <p>Priority: {selectedAnalysis.priorityLevel}</p>
                </div>
                <div className="detail-section">
                  <h4>Impact Projection</h4>
                  <p>CO₂: {selectedAnalysis.impact?.co2Sequestration?.toLocaleString()} tons/year</p>
                  <p>Water: {selectedAnalysis.impact?.waterRetention?.toLocaleString()} m³/year</p>
                  <p>Biodiversity: +{selectedAnalysis.impact?.biodiversityGain?.toFixed(1)} pts</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;