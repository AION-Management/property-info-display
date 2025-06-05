/**
 * DataInitializer Component - Firebase Data Management Tool
 * 
 * This component provides an admin interface for managing Firebase data:
 * - Allows initialization/restoration of test data
 * - Provides visual feedback during data operations
 * - Uses inline styling with styled-jsx for component encapsulation
 * - Handles loading states and error feedback
 * 
 * Key Features:
 * - Async data loading with proper error handling
 * - Loading spinner animation during data operations
 * - Color-coded status messages (info, success, error)
 * - Dismissible success notifications
 * - Disabled state during operations to prevent multiple submissions
 */

import React, { useState } from 'react';
import { initializeTestData } from '../services/dataLoader';

function DataInitializer() {
  // Loading state to prevent multiple simultaneous operations
  const [loading, setLoading] = useState(false);
  
  // Status object to display feedback messages with type classification
  const [status, setStatus] = useState(null);
  
  /**
   * Handles the data initialization process
   * - Manages loading state
   * - Calls the dataLoader service
   * - Provides user feedback on success/failure
   */
  const handleInitializeData = async () => {
    if (loading) return; // Prevent multiple simultaneous operations
    
    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Initializing test data...' });
      
      // Call the data loader service to populate Firebase
      await initializeTestData();
      
      setStatus({ type: 'success', message: 'Test data loaded successfully!' });
    } catch (error) {
      console.error('Error initializing data:', error);
      setStatus({ type: 'error', message: 'Failed to load test data. See console for details.' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="data-initializer">
      <h2>Data Management</h2>
      <p>Use this section to initialize or restore test data in Firebase.</p>
      
      {/* Action button section */}
      <div className="data-actions">
        <button 
          className={`data-button ${loading ? 'loading' : ''}`}
          onClick={handleInitializeData}
          disabled={loading} // Prevent clicks during operation
        >
          {loading ? 'Loading...' : 'Initialize Test Data'}
        </button>
      </div>
      
      {/* Status message display with conditional styling */}
      {status && (
        <div className={`data-status ${status.type}`}>
          <p>{status.message}</p>
          {/* Dismissible button for success messages */}
          {status.type === 'success' && (
            <button 
              className="status-dismiss" 
              onClick={() => setStatus(null)}
            >
              Dismiss
            </button>
          )}
        </div>
      )}
      
      {/* 
        Inline CSS using styled-jsx for component encapsulation
        This approach keeps styles close to the component and prevents conflicts
        Alternative: External CSS modules or styled-components could be used
      */}
      <style jsx>{`
        .data-initializer {
          background-color: white;
          border-radius: 12px;
          box-shadow: var(--shadow);
          padding: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .data-initializer h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 1rem;
          color: var(--dark-gray);
        }
        
        .data-actions {
          display: flex;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        /* Primary action button styling with hover and disabled states */
        .data-button {
          background-color: var(--orange);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .data-button:hover:not(:disabled) {
          background-color: #d97600;
        }
        
        .data-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        /* Loading state styling with spinner positioning */
        .data-button.loading {
          position: relative;
          padding-left: 3rem;
        }
        
        /* CSS spinner animation for loading state */
        .data-button.loading:before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: translateY(-50%) rotate(360deg); }
        }
        
        /* Status message container with flexible layout */
        .data-status {
          padding: 0.875rem;
          border-radius: 8px;
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .data-status p {
          margin: 0;
        }
        
        /* Color-coded status message types */
        .data-status.info {
          background-color: #e8f4fd;
          color: #0c63e4;
        }
        
        .data-status.success {
          background-color: #e8f8ed;
          color: #0e9f6e;
        }
        
        .data-status.error {
          background-color: #fef1f2;
          color: #e02424;
        }
        
        /* Minimal styling for dismiss button */
        .status-dismiss {
          background: none;
          border: none;
          font-size: 0.85rem;
          color: inherit;
          text-decoration: underline;
          cursor: pointer;
          padding: 0;
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );
}

export default DataInitializer; 