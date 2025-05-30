import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyDetails } from '../services/propertyService';
import '../styles/PropertyDetail.css';

function PropertyDetail() {
  const { stateId, propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadPropertyDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const propertyData = await getPropertyDetails(stateId, propertyId);
        setProperty(propertyData);
      } catch (err) {
        console.error('Error loading property details:', err);
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPropertyDetails();
  }, [stateId, propertyId]);
  
  const formatStateName = (stateId) => {
    if (stateId === 'newjersey') return 'New Jersey';
    return stateId.charAt(0).toUpperCase() + stateId.slice(1);
  };
  
  if (loading) {
    return (
      <div className="property-detail-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading property details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="property-detail-container">
        <div className="error-state">
          <h2>Property Not Found</h2>
          <p>{error || 'The requested property could not be found.'}</p>
          <div className="error-actions">
            <Link to={`/state/${stateId}`} className="back-link">Back to {formatStateName(stateId)}</Link>
            <Link to="/" className="back-link">All Properties</Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <div className="breadcrumb">
          <Link to="/">All Properties</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to={`/state/${stateId}`}>{formatStateName(stateId)}</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="current-page">{property.name}</span>
        </div>
        
        <h1 className="property-title">{property.name}</h1>
        <p className="property-address">{property.address}</p>
      </div>
      
      <div className="property-detail-content">
        <div className="property-info-section">
          <h2>Property Information</h2>
          <div className="info-grid">
            {property.units && (
              <div className="info-item">
                <label>Units:</label>
                <span>{property.units}</span>
              </div>
            )}
            {property.yearBuilt && (
              <div className="info-item">
                <label>Year Built:</label>
                <span>{property.yearBuilt}</span>
              </div>
            )}
            {property.renovated && (
              <div className="info-item">
                <label>Last Renovated:</label>
                <span>{property.renovated}</span>
              </div>
            )}
          </div>
          
          {property.description && (
            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
          )}
          
          {property.amenities && property.amenities.length > 0 && (
            <div className="property-amenities">
              <h3>Amenities</h3>
              <ul>
                {property.amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="staff-section">
          <h2>Staff Directory</h2>
          <div className="staff-grid">
            {property.staff && Object.entries(property.staff).map(([role, person]) => {
              if (!person.name) return null;
              
              const roleNames = {
                vp: 'Vice President',
                rem: 'Regional Manager',
                rsd: 'Regional Service Director',
                ds: 'District Supervisor',
                pm: 'Property Manager'
              };
              
              return (
                <div key={role} className="staff-card">
                  <h3 className="staff-role">{roleNames[role]}</h3>
                  <p className="staff-name">{person.name}</p>
                  {person.email && (
                    <a href={`mailto:${person.email}`} className="staff-email">
                      {person.email}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {property.contact && (property.contact.phone || property.contact.email) && (
          <div className="contact-section">
            <h2>Primary Contact</h2>
            <div className="contact-info">
              {property.contact.manager && (
                <div className="contact-item">
                  <label>Manager:</label>
                  <span>{property.contact.manager}</span>
                </div>
              )}
              {property.contact.phone && (
                <div className="contact-item">
                  <label>Phone:</label>
                  <a href={`tel:${property.contact.phone}`}>{property.contact.phone}</a>
                </div>
              )}
              {property.contact.email && (
                <div className="contact-item">
                  <label>Email:</label>
                  <a href={`mailto:${property.contact.email}`}>{property.contact.email}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetail; 