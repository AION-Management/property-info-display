/**
 * Navigation Component - Sidebar Navigation for Property Info Display
 * 
 * This component provides the main navigation interface for the application:
 * - State-based navigation to filter properties by state
 * - Mobile-responsive hamburger menu
 * - Admin access link
 * - Automatic menu collapse on mobile after navigation
 * 
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Active state highlighting for current route
 * - Predefined list of states with properties
 * - Separate admin section with visual divider
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';

// Static list of states that have property data
// This could be moved to a configuration file or loaded dynamically
const states = [
  { id: 'delaware', name: 'Delaware' },
  { id: 'indiana', name: 'Indiana' },
  { id: 'maryland', name: 'Maryland' },
  { id: 'newJersey', name: 'New Jersey' },
  { id: 'ohio', name: 'Ohio' },
  { id: 'pennsylvania', name: 'Pennsylvania' },
  { id: 'virginia', name: 'Virginia' }
];

function Navigation() {
  // State to control mobile menu visibility
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navigation">
      {/* Mobile hamburger menu toggle button */}
      <div className="navigation-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Navigation menu - responsive with mobile toggle */}
      <div className={`navigation-menu ${isOpen ? 'open' : ''}`}>
        {/* Home/All Properties link */}
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setIsOpen(false)} // Close mobile menu on navigation
        >
          All Properties
        </NavLink>
        
        {/* Dynamic state navigation links */}
        {states.map(state => (
          <NavLink 
            key={state.id}
            to={`/state/${state.id}`} 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            onClick={() => setIsOpen(false)} // Close mobile menu on navigation
          >
            {state.name}
          </NavLink>
        ))}
        
        {/* Visual separator before admin section */}
        <div className="nav-divider"></div>
        
        {/* Admin section - separated for security/organizational clarity */}
        <NavLink 
          to="/admin" 
          className={({ isActive }) => isActive ? 'nav-link admin active' : 'nav-link admin'}
          onClick={() => setIsOpen(false)} // Close mobile menu on navigation
        >
          Admin
        </NavLink>
      </div>
    </nav>
  );
}

export default Navigation; 