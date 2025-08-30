/**
 * Admin Dashboard Page - Administrative Interface for Property Data Management
 * 
 * This page provides administrative tools for managing the application's data and settings.
 * It serves as a central hub for system administration tasks.
 * 
 * Key Features:
 * - Data initialization and management tools
 * - Test data loading for development/demo purposes
 * - Firebase configuration display and status
 * - Visual feedback with status icons and messages
 * - Loading state management for async operations
 * 
 * Use Cases:
 * - Initial application setup
 * - Restoring demo/test data
 * - System configuration verification
 * - Data management during development
 */

import React, { useState } from 'react';
import { initializeTestData } from '../services/dataLoader';
import '../styles/Admin.css';

function Admin() {
  // Loading state to prevent multiple simultaneous operations
  const [loading, setLoading] = useState(false);
  
  // Status state for user feedback (info, success, error)
  const [status, setStatus] = useState(null);
  
  /**
   * Handles test data initialization
   * - Prevents multiple simultaneous operations
   * - Provides real-time status updates
   * - Calls the dataLoader service to populate Firebase
   */
  const handleInitializeData = async () => {
    if (loading) return; // Prevent concurrent operations
    
    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Initializing test data...' });
      
      // Call the data loader service to populate Firebase with test data
      await initializeTestData();
      
      setStatus({ 
        type: 'success', 
        message: 'Test data loaded successfully! You can now view properties from the navigation menu.' 
      });
    } catch (error) {
      console.error('Error initializing data:', error);
      setStatus({ 
        type: 'error', 
        message: 'Failed to load test data. See console for details.' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-description">
        This page provides administrative tools to manage the application data and settings.
      </p>
      
      <div className="admin-sections">
        {/* Quick Actions Section - Primary administrative tools */}
        <section className="admin-section">
          <h2 className="section-title">Quick Actions</h2>
          
          <div className="admin-card">
            <div className="card-header">
              <h3>Load Test Data</h3>
              <p>Initialize Firebase with sample property data for testing.</p>
            </div>
            
            {/* Action button with loading state */}
            <div className="card-actions">
              <button 
                className={`admin-button primary ${loading ? 'loading' : ''}`}
                onClick={handleInitializeData}
                disabled={loading} // Prevent clicks during operation
              >
                {loading ? 'Loading...' : 'Initialize Test Data'}
              </button>
            </div>
            
            {/* Status message display with icons for different states */}
            {status && (
              <div className={`status-message ${status.type}`}>
                <div className="status-icon">
                  {/* Success checkmark icon */}
                  {status.type === 'success' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  )}
                  {/* Error exclamation icon */}
                  {status.type === 'error' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  )}
                  {/* Info information icon */}
                  {status.type === 'info' && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  )}
                </div>
                <p>{status.message}</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Firebase Configuration Section - Display connection info */}
        <section className="admin-section">
          <h2 className="section-title">Firebase Configuration</h2>
          <div className="admin-card">
            <p>The application is currently connected to the Firebase project:</p>
            <code className="config-code">property-info-1900</code>
            
            {/* Configuration details display */}
            <div className="config-details">
              <div className="config-item">
                <span className="config-label">Project ID:</span>
                <span className="config-value">property-info-1900</span>
              </div>
              <div className="config-item">
                <span className="config-label">Database URL:</span>
                <span className="config-value">https://property-info-1900-default-rtdb.firebaseio.com</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin; 