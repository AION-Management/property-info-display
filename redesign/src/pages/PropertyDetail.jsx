import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPropertyDetails } from '../services/propertyService';
import '../styles/PropertyDetail.css';

function PropertyDetail() {
  const { stateId, propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [propertyData, setPropertyData] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const data = await getPropertyDetails(stateId, propertyId);
        setPropertyData(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching details for ${propertyId}:`, err);
        setError(`Failed to load property details. Please try again later.`);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [stateId, propertyId]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="property-detail-header">
          <Link to={`/state/${stateId}`} className="back-button">
            ← Back to {stateId.charAt(0).toUpperCase() + stateId.slice(1)} Properties
          </Link>
          <h1 className="property-detail-title">Error</h1>
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
  
  if (!propertyData) {
    return (
      <div className="property-detail-container">
        <div className="property-detail-header">
          <Link to={`/state/${stateId}`} className="back-button">
            ← Back to {stateId ? stateId.charAt(0).toUpperCase() + stateId.slice(1) : ''} Properties
          </Link>
          <h1 className="property-detail-title">Property Not Found</h1>
        </div>
        <div className="not-found-message">
          <p>The property you're looking for doesn't exist or has been moved.</p>
          <button 
            className="primary-button" 
            onClick={() => navigate(`/state/${stateId}`)}
          >
            Return to State Properties
          </button>
        </div>
      </div>
    );
  }

  // Ensure property data is properly formatted for display
  const displayData = {
    ...propertyData,
    name: propertyData.name || propertyId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    address: propertyData.address || 'Address not available',
    description: propertyData.description || 'No description available',
    units: propertyData.units || propertyData.unit || 'N/A', // Handle both units and unit
    yearBuilt: propertyData.yearBuilt || 'N/A',
    renovated: propertyData.renovated || 'N/A',
    amenities: propertyData.amenities || [],
    contact: propertyData.contact || {
      manager: '',
      phone: '',
      email: ''
    },
    staff: propertyData.staff || {
      vp: { name: '', email: '' },
      rem: { name: '', email: '' },
      rsd: { name: '', email: '' },
      ds: { name: '', email: '' },
      pm: { name: '', email: '' }
    },
    images: (propertyData.images && propertyData.images.length > 0) 
      ? propertyData.images 
      : ['/logo.png']
  };

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <Link to={`/state/${stateId}`} className="back-button">
          ← Back to {stateId.charAt(0).toUpperCase() + stateId.slice(1)} Properties
        </Link>
        <h1 className="property-detail-title">{displayData.name}</h1>
      </div>
      
      <div className="property-detail-content">
        <div className="property-detail-hero">
          <div className="property-detail-image">
            {displayData.images && displayData.images.length > 0 ? (
              <img src={displayData.images[0]} alt={displayData.name} />
            ) : (
              <div className="placeholder-image">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          
          <div className="property-address">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{displayData.address}</span>
          </div>
        </div>
        
        <div className="property-detail-info-grid">
          <div className="property-detail-card">
            <h2>Property Overview</h2>
            <p className="property-description">{displayData.description}</p>
            
            <div className="property-stats">
              <div className="property-stat">
                <span className="stat-label">Units</span>
                <span className="stat-value">{displayData.units}</span>
              </div>
              <div className="property-stat">
                <span className="stat-label">Year Built</span>
                <span className="stat-value">{displayData.yearBuilt}</span>
              </div>
              <div className="property-stat">
                <span className="stat-label">Renovated</span>
                <span className="stat-value">{displayData.renovated}</span>
              </div>
            </div>
          </div>
          
          {displayData.amenities && displayData.amenities.length > 0 && (
            <div className="property-detail-card">
              <h2>Amenities</h2>
              <ul className="amenities-list">
                {displayData.amenities.map((amenity, index) => (
                  <li key={index} className="amenity-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="property-detail-card">
            <h2>Staff Information</h2>
            <div className="staff-grid">
              {displayData.staff.vp.name && (
                <div className="staff-item">
                  <h3>Vice President</h3>
                  <div className="staff-contact">
                    <span className="staff-name">{displayData.staff.vp.name}</span>
                    {displayData.staff.vp.email && (
                      <a href={`mailto:${displayData.staff.vp.email}`} className="staff-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{displayData.staff.vp.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {displayData.staff.rem.name && (
                <div className="staff-item">
                  <h3>Regional REM</h3>
                  <div className="staff-contact">
                    <span className="staff-name">{displayData.staff.rem.name}</span>
                    {displayData.staff.rem.email && (
                      <a href={`mailto:${displayData.staff.rem.email}`} className="staff-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{displayData.staff.rem.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {displayData.staff.rsd.name && (
                <div className="staff-item">
                  <h3>Regional SD</h3>
                  <div className="staff-contact">
                    <span className="staff-name">{displayData.staff.rsd.name}</span>
                    {displayData.staff.rsd.email && (
                      <a href={`mailto:${displayData.staff.rsd.email}`} className="staff-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{displayData.staff.rsd.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {displayData.staff.ds.name && (
                <div className="staff-item">
                  <h3>Director of Service</h3>
                  <div className="staff-contact">
                    <span className="staff-name">{displayData.staff.ds.name}</span>
                    {displayData.staff.ds.email && (
                      <a href={`mailto:${displayData.staff.ds.email}`} className="staff-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{displayData.staff.ds.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {displayData.staff.pm.name && (
                <div className="staff-item">
                  <h3>Property Manager</h3>
                  <div className="staff-contact">
                    <span className="staff-name">{displayData.staff.pm.name}</span>
                    {displayData.staff.pm.email && (
                      <a href={`mailto:${displayData.staff.pm.email}`} className="staff-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{displayData.staff.pm.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {displayData.contact && displayData.contact.phone && (
            <div className="property-detail-card">
              <h2>Contact Information</h2>
              <div className="contact-info">
                {displayData.contact.manager && (
                  <div className="contact-info-item">
                    <span className="contact-label">Property Manager</span>
                    <span className="contact-value">{displayData.contact.manager}</span>
                  </div>
                )}
                {displayData.contact.phone && (
                  <div className="contact-info-item">
                    <span className="contact-label">Phone</span>
                    <span className="contact-value">{displayData.contact.phone}</span>
                  </div>
                )}
                {displayData.contact.email && (
                  <div className="contact-info-item">
                    <span className="contact-label">Email</span>
                    <a href={`mailto:${displayData.contact.email}`} className="contact-value contact-link">{displayData.contact.email}</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail; 