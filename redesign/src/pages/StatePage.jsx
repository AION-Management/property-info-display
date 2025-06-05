import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPropertiesByState } from '../services/propertyService';
import '../styles/StatePage.css';

function StatePage() {
  const { stateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [stateProperties, setStateProperties] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStateProperties = async () => {
      try {
        setLoading(true);
        const data = await getPropertiesByState(stateId);
        setStateProperties(data || {});
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching properties for ${stateId}:`, err);
        setError(`Failed to load properties for ${stateId}. Please try again later.`);
        setLoading(false);
      }
    };

    fetchStateProperties();
  }, [stateId]);
  
  const stateName = stateId ? stateId.charAt(0).toUpperCase() + stateId.slice(1) : '';
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {stateName} properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="state-header">
          <Link to="/" className="back-button">
            ← All Properties
          </Link>
          <h1 className="state-page-title">{stateName}</h1>
        </div>
        <p>{error}</p>
        <button 
          className="primary-button" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (Object.keys(stateProperties).length === 0) {
    return (
      <div className="state-container">
        <div className="state-header">
          <Link to="/" className="back-button">
            ← All Properties
          </Link>
          <h1 className="state-page-title">{stateName}</h1>
        </div>
        <p>No properties found for this state.</p>
      </div>
    );
  }

  return (
    <div className="state-container">
      <div className="state-header">
        <Link to="/" className="back-button">
          ← All Properties
        </Link>
        <h1 className="state-page-title">{stateName}</h1>
      </div>
      
      <div className="state-property-grid">
        {Object.entries(stateProperties).map(([propertyId, property]) => (
          <Link 
            to={`/property/${stateId}/${propertyId}`} 
            key={propertyId}
            className="state-property-card"
          >
            <div className="property-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="state-property-content">
              <h3 className="state-property-name">{property.name}</h3>
              <span className="view-details">View Details</span>
            </div>
            
            <div className="chevron">
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StatePage; 