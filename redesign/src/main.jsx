/**
 * Main Entry Point for Property Info Display Redesign
 * 
 * This file serves as the application's entry point, responsible for:
 * - Mounting the React application to the DOM
 * - Importing global styles
 * - Wrapping the app in React.StrictMode for development warnings
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Create the root element and render the application
// React.StrictMode helps identify potential problems in development
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 