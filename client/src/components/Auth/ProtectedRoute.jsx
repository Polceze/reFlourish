import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Login from "./Login";
import Register from "./Register";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("login");

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner-large"></div>
        <p>Loading ReFlourish...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-required-screen">
        <div className="auth-required-content">
          {/* Left Side - Welcome/Features */}
          <div className="welcome-section">
            <div className="welcome-header">
              <h1>ReFlourish</h1>
              <p className="welcome-subtitle">Ecosystem Enhancement Platform</p>
            </div>

            <div className="feature-list">
              <h2>Transform Ecosystems with Data</h2>
              <div className="feature-grid">
                <div className="feature-card">
                  <div>
                    <h3>Satellite Intelligence</h3>
                    <p>Real-time vegetation analysis using Sentinel-2 data</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div>
                    <h3>Climate Insights</h3>
                    <p>Historical weather patterns and rainfall data</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div>
                    <h3>Impact Projections</h3>
                    <p>Quantify CO₂ sequestration and biodiversity gains</p>
                  </div>
                </div>
                <div className="feature-card">
                  <div>
                    <h3>Save & Track</h3>
                    <p>Build your portfolio of ecosystem projects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication */}
          <div className="auth-section">
            <div className="auth-container">
              {currentView === "login" ? (
                <Login
                  onSwitchToRegister={() => setCurrentView("register")}
                  onClose={null}
                />
              ) : (
                <Register
                  onSwitchToLogin={() => setCurrentView("login")}
                  onClose={null}
                />
              )}
            </div>

            <div className="demo-notice">
              <p>
                Transform your ecosystem restoration with satellite-powered
                insights
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
