/**
 * Home Page Component - Landing Page for Property Info Display
 * 
 * This component serves as the main landing page and displays:
 * - All properties grouped by state
 * - Grid layout for easy browsing
 * - Loading states and error handling
 * - Navigation links to individual property detail pages
 * 
 * Key Features:
 * - Fetches all property data on component mount
 * - Handles loading, error, and empty states gracefully
 * - Organizes properties by state with visual grouping
 * - Responsive grid layout for property cards
 * - Direct navigation to property details via React Router Links
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProperties } from '../services/propertyService';
import '../styles/Home.css';

function Home() {
  // Loading state for initial data fetch
  const [loading, setLoading] = useState(true);
  
  // Property data organized by state -> properties structure
  const [propertyData, setPropertyData] = useState({});
  
  // Error state for fetch failures
  const [error, setError] = useState(null);

  // Fetch all properties when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Get all properties from Firebase via the property service
        const data = await getAllProperties();
        setPropertyData(data || {}); // Ensure we have a fallback object
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []); // Empty dependency array - only run on mount

  // Loading state UI - displays spinner and loading message
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading properties...</p>
      </div>
    );
  }

  // Error state UI - displays error message with retry option
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="primary-button" 
          onClick={() => window.location.reload()} // Simple retry via page reload
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state UI - when no properties are available
  if (Object.keys(propertyData).length === 0) {
    return (
      <div className="empty-container">
        <h1 className="home-title">All Properties</h1>
        <p>No properties found. Check back later.</p>
      </div>
    );
  }

  // Main content rendering - property data organized by state
  return (
    <div className="home-container">
      <h1 className="home-title">All Properties</h1>
      
      {/* State sections - each state gets its own section */}
      <div className="state-sections">
        {Object.entries(propertyData).map(([stateId, properties]) => (
          <div key={stateId} className="state-section">
            {/* State header with capitalized state name */}
            <h2 className="state-title">{stateId.charAt(0).toUpperCase() + stateId.slice(1)}</h2>
            
            {/* Property grid - responsive layout for property cards */}
            <div className="property-grid">
              {Object.entries(properties).map(([propertyId, property]) => (
                <Link 
                  to={`/property/${stateId}/${propertyId}`} 
                  key={propertyId}
                  className="property-card"
                >
                  <div className="property-card-content">
                    {/* Property name display */}
                    <h3 className="property-name">{property.name}</h3>
                    {/* Visual indicator for navigation */}
                    <span className="property-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home; 