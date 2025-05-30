/**
 * Admin Page Component - Data Management Interface
 * 
 * This component provides administrative tools for managing the Property Info Display system:
 * - Data initialization and management tools
 * - Firebase configuration display for troubleshooting
 * - System status monitoring
 * - Quick access to data management operations
 * 
 * Key Features:
 * - Data management through DataInitializer component
 * - Firebase configuration display for debugging
 * - Responsive layout with proper spacing
 * - Integration with Firebase services
 * 
 * Security Note:
 * In a production environment, this page should be protected with
 * authentication and authorization to prevent unauthorized access.
 */

import React from 'react';
import DataInitializer from '../components/DataInitializer';
import '../styles/Admin.css';

function Admin() {
  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-header">
        <h1>Administration</h1>
        <p className="admin-description">
          Manage property data and system configuration. 
          Use the tools below to initialize test data or troubleshoot system issues.
        </p>
      </div>
      
      {/* Main Content Area */}
      <div className="admin-content">
        {/* 
          Data Management Section
          Uses the DataInitializer component for Firebase data operations
        */}
        <section className="admin-section">
          <DataInitializer />
        </section>
        
        {/* 
          System Information Section
          Displays Firebase configuration and connection status
        */}
        <section className="admin-section">
          <div className="system-info">
            <h2>System Information</h2>
            <p>Current system configuration and status information.</p>
            
            {/* Firebase Configuration Display */}
            <div className="config-section">
              <h3>Firebase Configuration</h3>
              <div className="config-details">
                <div className="config-item">
                  <label>Project ID:</label>
                  <span>property-info-1900</span>
                </div>
                <div className="config-item">
                  <label>Database URL:</label>
                  <span>https://property-info-1900-default-rtdb.firebaseio.com</span>
                </div>
                <div className="config-item">
                  <label>Auth Domain:</label>
                  <span>property-info-1900.firebaseapp.com</span>
                </div>
                <div className="config-item">
                  <label>Status:</label>
                  <span className="status-connected">Connected</span>
                </div>
              </div>
            </div>
            
            {/* Application Information */}
            <div className="config-section">
              <h3>Application Information</h3>
              <div className="config-details">
                <div className="config-item">
                  <label>Version:</label>
                  <span>1.0.0 (Redesign POC)</span>
                </div>
                <div className="config-item">
                  <label>Environment:</label>
                  <span>{process.env.NODE_ENV || 'development'}</span>
                </div>
                <div className="config-item">
                  <label>Build Date:</label>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* 
          Quick Actions Section
          Additional administrative tools and shortcuts
        */}
        <section className="admin-section">
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <p>Common administrative tasks and navigation shortcuts.</p>
            
            <div className="actions-grid">
              {/* Action buttons for common tasks */}
              <button 
                className="action-button"
                onClick={() => window.open('https://console.firebase.google.com/project/property-info-1900', '_blank')}
              >
                <span className="action-icon">🔧</span>
                <span className="action-text">Firebase Console</span>
              </button>
              
              <button 
                className="action-button"
                onClick={() => window.location.href = '/'}
              >
                <span className="action-icon">🏠</span>
                <span className="action-text">View Properties</span>
              </button>
              
              <button 
                className="action-button"
                onClick={() => {
                  const confirmed = window.confirm('Are you sure you want to reload the page? Any unsaved changes will be lost.');
                  if (confirmed) {
                    window.location.reload();
                  }
                }}
              >
                <span className="action-icon">🔄</span>
                <span className="action-text">Refresh System</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin; 