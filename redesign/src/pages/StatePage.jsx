import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertiesByState } from '../services/propertyService';
import '../styles/StatePage.css';

function StatePage() {
  const { stateId } = useParams();
  const [properties, setProperties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadStateProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const propertiesData = await getPropertiesByState(stateId);
        setProperties(propertiesData);
      } catch (err) {
        console.error('Error loading state properties:', err);
        setError('Failed to load properties for this state.');
      } finally {
        setLoading(false);
      }
    };
    
    loadStateProperties();
  }, [stateId]);
  
  const formatStateName = (stateId) => {
    if (stateId === 'newjersey') return 'New Jersey';
    return stateId.charAt(0).toUpperCase() + stateId.slice(1);
  };
  
  if (loading) {
    return (
      <div className="state-page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="state-page-container">
        <div className="error-state">
          <h2>Error Loading Properties</h2>
          <p>{error}</p>
          <Link to="/" className="back-link">Back to All Properties</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="state-page-container">
      <div className="state-page-header">
        <h1>Properties in {formatStateName(stateId)}</h1>
        <Link to="/" className="back-link">← Back to All Properties</Link>
      </div>
      
      {Object.keys(properties).length === 0 ? (
        <div className="empty-state">
          <h2>No Properties Found</h2>
          <p>No properties are currently available in {formatStateName(stateId)}.</p>
        </div>
      ) : (
        <div className="properties-grid">
          {Object.entries(properties).map(([propertyId, property]) => (
            <Link 
              key={propertyId}
              to={`/property/${stateId}/${propertyId}`}
              className="property-card"
            >
              <div className="property-card-content">
                <h3 className="property-name">{property.name}</h3>
                <p className="property-address">{property.address}</p>
                <div className="property-details">
                  {property.units && (
                    <span className="property-units">{property.units} units</span>
                  )}
                  {property.contact.manager && (
                    <span className="property-manager">Manager: {property.contact.manager}</span>
                  )}
                </div>
              </div>
              <div className="property-card-arrow">→</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatePage; 