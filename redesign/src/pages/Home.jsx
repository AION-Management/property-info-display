/**
 * Home Page Component - Property Info Display Landing Page
 * 
 * This component serves as the application's main landing page and provides:
 * - Overview of all properties organized by state
 * - Quick navigation to specific properties or states
 * - Error handling for data loading failures
 * - Loading states with proper user feedback
 * 
 * Data Flow:
 * 1. Loads all property data on component mount
 * 2. Organizes properties by state for easy browsing
 * 3. Provides direct links to individual property details
 * 4. Handles edge cases (empty data, loading errors)
 * 
 * Layout Structure:
 * - Header with welcome message and overview
 * - State sections with property cards
 * - Responsive grid layout for property listings
 * - Error and loading state UI feedback
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProperties } from '../services/propertyService';
import '../styles/Home.css';

function Home() {
  // State management for component data and UI states
  const [properties, setProperties] = useState({}); // Object organized by state
  const [loading, setLoading] = useState(true);     // Loading indicator
  const [error, setError] = useState(null);         // Error message storage
  
  /**
   * Load Property Data on Component Mount
   * 
   * Fetches all property data from Firebase and organizes it by state.
   * Implements proper error handling and loading state management.
   */
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all properties from the property service
        const propertiesData = await getAllProperties();
        
        console.log('Loaded properties data:', propertiesData);
        setProperties(propertiesData);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load property data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProperties();
  }, []); // Empty dependency array = run once on mount
  
  /**
   * Format State Name for Display
   * 
   * Converts database state IDs to user-friendly display names.
   * Handles special cases like "newjersey" → "New Jersey"
   * 
   * @param {string} stateId - The state identifier from database
   * @returns {string} Formatted display name
   */
  const formatStateName = (stateId) => {
    // Handle special case for New Jersey
    if (stateId === 'newjersey') return 'New Jersey';
    
    // Convert camelCase/lowercase to Title Case
    return stateId.charAt(0).toUpperCase() + stateId.slice(1);
  };
  
  // Loading State UI
  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading property information...</p>
        </div>
      </div>
    );
  }
  
  // Error State UI
  if (error) {
    return (
      <div className="home-container">
        <div className="error-state">
          <h2>Unable to Load Properties</h2>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Main Content Render
  return (
    <div className="home-container">
      {/* Page Header with Welcome Information */}
      <div className="home-header">
        <h1>Property Information</h1>
        <p className="home-description">
          Browse our portfolio of properties across multiple states. 
          Click on any property to view detailed information including 
          contact details, amenities, and staff information.
        </p>
      </div>
      
      {/* Properties organized by state */}
      <div className="properties-by-state">
        {/* Check if we have any property data */}
        {Object.keys(properties).length === 0 ? (
          <div className="empty-state">
            <h2>No Properties Available</h2>
            <p>No property data is currently available. Please check back later or contact an administrator.</p>
            <Link to="/admin" className="admin-link">
              Initialize Data
            </Link>
          </div>
        ) : (
          /* Render each state section with its properties */
          Object.entries(properties).map(([stateId, stateProperties]) => (
            <div key={stateId} className="state-section">
              {/* State header with navigation link */}
              <div className="state-header">
                <h2>
                  <Link 
                    to={`/state/${stateId}`} 
                    className="state-title-link"
                  >
                    {formatStateName(stateId)}
                  </Link>
                </h2>
                <p className="property-count">
                  {Object.keys(stateProperties).length} properties
                </p>
              </div>
              
              {/* Grid of property cards for this state */}
              <div className="properties-grid">
                {Object.entries(stateProperties).map(([propertyId, property]) => (
                  <Link 
                    key={propertyId}
                    to={`/property/${stateId}/${propertyId}`}
                    className="property-card"
                  >
                    {/* Property card content */}
                    <div className="property-card-content">
                      <h3 className="property-name">{property.name}</h3>
                      <p className="property-address">{property.address}</p>
                      {/* Additional property details */}
                      <div className="property-details">
                        {property.units && (
                          <span className="property-units">{property.units} units</span>
                        )}
                        {property.contact.manager && (
                          <span className="property-manager">Manager: {property.contact.manager}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Visual indicator for card interaction */}
                    <div className="property-card-arrow">→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home; 