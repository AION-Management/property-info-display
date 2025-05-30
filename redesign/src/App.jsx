/**
 * Main Application Component - Property Info Display Redesign
 * 
 * This component serves as the root of the application and establishes:
 * - Client-side routing using React Router
 * - Overall layout structure (header, sidebar navigation, main content)
 * - Route definitions for different pages
 * 
 * Layout Structure:
 * - Header: Contains logo and main title
 * - Sidebar: Navigation component for state/property browsing
 * - Main: Dynamic content area that renders different pages based on route
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import StatePage from './pages/StatePage';
import PropertyDetail from './pages/PropertyDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Application Header - Logo and Title */}
        <header className="app-header">
          <img src="/logo.png" alt="Aion Logo" className="app-logo" />
          <h1>Property Information</h1>
        </header>
        
        <div className="app-content">
          {/* Sidebar Navigation - State and property browsing */}
          <aside className="app-sidebar">
            <Navigation />
          </aside>
          
          {/* Main Content Area - Dynamic page rendering */}
          <main className="app-main">
            <Routes>
              {/* Home page - landing/overview page */}
              <Route path="/" element={<Home />} />
              
              {/* State page - shows properties within a specific state */}
              <Route path="/state/:stateId" element={<StatePage />} />
              
              {/* Property detail page - detailed view of individual property */}
              <Route path="/property/:stateId/:propertyId" element={<PropertyDetail />} />
              
              {/* Admin page - data management and configuration */}
              <Route path="/admin" element={<Admin />} />
              
              {/* Additional routes will be added later as the application grows */}
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App; 