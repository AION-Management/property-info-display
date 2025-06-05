/**
 * Data Loader Service - Firebase Data Population and Migration Tools
 * 
 * This service provides utilities for populating Firebase with property data.
 * It supports both manual test data initialization and HTML parsing for data migration.
 * 
 * Key Responsibilities:
 * - Initialize Firebase with comprehensive test data
 * - Parse existing HTML property pages for data migration
 * - Extract contact information from various HTML formats
 * - Standardize property data structure across sources
 * - Batch data operations for efficient Firebase writes
 * 
 * Use Cases:
 * - Initial application setup with sample data
 * - Migration from existing HTML-based property pages
 * - Development and testing data management
 * - Demo environment preparation
 */

import { savePropertyData } from './propertyService';

/**
 * Extract Property Data from HTML Structure
 * 
 * Parses HTML elements to extract property information in a standardized format.
 * This function is designed to work with existing HTML property page structures.
 * 
 * @param {Element} propertyElement - DOM element containing property information
 * @param {string} state - State name for organization
 * @returns {object} Standardized property data object
 */
const extractPropertyDataFromHtml = (propertyElement, state) => {
  const titleElement = propertyElement.querySelector('h2 span');
  const propertyName = titleElement ? titleElement.textContent.trim() : 'Unknown Property';
  
  // Get address
  const addressElement = propertyElement.querySelector('p:nth-child(2) span');
  const address = addressElement ? addressElement.textContent.trim() : '';
  
  // Get unit count
  const unitElement = propertyElement.querySelector('[id$="-unit"]');
  const units = unitElement ? unitElement.textContent.trim() : '';
  
  // Get the different roles
  const vpElement = propertyElement.querySelector('[id$="-vp"]');
  const remElement = propertyElement.querySelector('[id$="-rem"]');
  const rsdElement = propertyElement.querySelector('[id$="-rsd"]');
  const dsElement = propertyElement.querySelector('[id$="-ds"]');
  const pmElement = propertyElement.querySelector('[id$="-pm"]');
  
  // Create object for this property
  const propertyData = {
    name: propertyName,
    address: address,
    unit: units,
    vp: extractContactInfo(vpElement),
    rem: extractContactInfo(remElement),
    rsd: extractContactInfo(rsdElement),
    ds: extractContactInfo(dsElement),
    pm: extractContactInfo(pmElement)
  };
  
  return propertyData;
};

/**
 * Extract Contact Information from HTML Element
 * 
 * Handles different HTML formats for contact information:
 * - Plain text names
 * - Email links (mailto: format)
 * - Mixed content elements
 * 
 * @param {Element} element - DOM element containing contact information
 * @returns {object|null} Contact object with name and optional email
 */
const extractContactInfo = (element) => {
  if (!element) return null;
  
  // Check if it's a direct text or an anchor link
  if (element.querySelector('a')) {
    const linkElement = element.querySelector('a');
    const name = linkElement.textContent.trim();
    const email = linkElement.getAttribute('href').replace('mailto:', '');
    return { name, email };
  } else {
    const text = element.textContent.trim();
    return text ? { name: text } : null;
  }
};

/**
 * Load Properties from HTML Pages
 * 
 * Fetches and parses existing HTML property pages to populate Firebase.
 * This function enables migration from static HTML to dynamic database storage.
 * 
 * Migration Process:
 * 1. Fetch HTML pages for each state
 * 2. Parse property elements using DOM selectors
 * 3. Extract and standardize property data
 * 4. Save to Firebase using the property service
 * 
 * @returns {Promise<boolean>} Success indicator
 */
export const loadPropertiesFromHtml = async () => {
  try {
    // Get all state pages
    const states = ['Delaware', 'Indiana', 'Maryland', 'New Jersey', 'Ohio', 'Pennsylvania', 'Virginia'];
    
    for (const state of states) {
      // In a real scenario, we would fetch the HTML page for each state
      // For this example, we'll use a manual approach
      
      const stateId = state.toLowerCase();
      const response = await fetch(`/${stateId}.html`);
      const html = await response.text();
      
      // Create a DOM parser
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Get all property elements
      const propertyElements = doc.querySelectorAll('#container > div');
      
      for (const propertyElement of propertyElements) {
        const propertyData = extractPropertyDataFromHtml(propertyElement, state);
        const propertyId = propertyData.name.toLowerCase().replace(/\s+/g, '-');
        
        // Save to Firebase
        await savePropertyData(state, propertyId, propertyData);
      }
      
      console.log(`Loaded properties for ${state}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error loading property data:', error);
    throw error;
  }
};

/**
 * Initialize Test Data
 * 
 * Populates Firebase with comprehensive test data for development and demo purposes.
 * This includes sample properties across multiple states with complete staff information.
 * 
 * Test Data Structure:
 * - Multiple properties per state
 * - Complete staff hierarchy (VP, REM, RSD, DS, PM)
 * - Realistic addresses and unit counts
 * - Consistent email format for testing
 * 
 * @returns {Promise<boolean>} Success indicator
 */
export const initializeTestData = async () => {
  // Test data for multiple states
  const testData = {
    'Delaware': {
      'westover-pointe': {
        name: 'Westover Pointe',
        address: '500 Westover Dr, New Castle, DE 19720',
        unit: '216',
        vp: { name: 'Jane Smith', email: 'jane.smith@example.com' },
        rem: { name: 'Robert Johnson', email: 'robert.johnson@example.com' },
        rsd: { name: 'Emily Davis', email: 'emily.davis@example.com' },
        ds: { name: 'Michael Wilson', email: 'michael.wilson@example.com' },
        pm: { name: 'Sarah Thompson', email: 'sarah.thompson@example.com' }
      },
      'hunters-crossing': {
        name: 'Hunters Crossing',
        address: '123 Hunters Way, Newark, DE 19711',
        unit: '180',
        vp: { name: 'Thomas Walker', email: 'thomas.walker@example.com' },
        rem: { name: 'Jennifer Lee', email: 'jennifer.lee@example.com' },
        rsd: { name: 'David Brown', email: 'david.brown@example.com' },
        ds: { name: 'Melissa Green', email: 'melissa.green@example.com' },
        pm: { name: 'Richard Hill', email: 'richard.hill@example.com' }
      }
    },
    'Pennsylvania': {
      '1869west': {
        name: '1869 West',
        address: '1869 Chessland St #15, Pittsburgh, PA 15205',
        unit: '150',
        vp: { name: 'Thomas Walker', email: 'thomas.walker@example.com' },
        rem: { name: 'Jennifer Lee', email: 'jennifer.lee@example.com' },
        rsd: { name: 'David Brown', email: 'david.brown@example.com' },
        ds: { name: 'Melissa Green', email: 'melissa.green@example.com' },
        pm: { name: 'Richard Hill', email: 'richard.hill@example.com' }
      },
      '214vine': {
        name: '214 Vine',
        address: '214 Vine St, Philadelphia, PA 19106',
        unit: '120',
        vp: { name: 'Karen Martinez', email: 'karen.martinez@example.com' },
        rem: { name: 'James Wilson', email: 'james.wilson@example.com' },
        rsd: { name: 'Patricia Taylor', email: 'patricia.taylor@example.com' },
        ds: { name: 'Joseph Anderson', email: 'joseph.anderson@example.com' },
        pm: { name: 'Linda Thomas', email: 'linda.thomas@example.com' }
      }
    },
    'New Jersey': {
      'aspen-court': {
        name: 'Aspen Court',
        address: '2800 New Brunswick Ave, Piscataway, NJ 08854',
        unit: '190',
        vp: { name: 'William Clark', email: 'william.clark@example.com' },
        rem: { name: 'Barbara Lewis', email: 'barbara.lewis@example.com' },
        rsd: { name: 'Charles White', email: 'charles.white@example.com' },
        ds: { name: 'Elizabeth Harris', email: 'elizabeth.harris@example.com' },
        pm: { name: 'Robert Brown', email: 'robert.brown@example.com' }
      },
      'cherry-hill-towers': {
        name: 'Cherry Hill Towers',
        address: '2145 NJ-38, Cherry Hill, NJ 08002',
        unit: '250',
        vp: { name: 'Daniel Turner', email: 'daniel.turner@example.com' },
        rem: { name: 'Susan Martin', email: 'susan.martin@example.com' },
        rsd: { name: 'Kevin Johnson', email: 'kevin.johnson@example.com' },
        ds: { name: 'Lisa Wilson', email: 'lisa.wilson@example.com' },
        pm: { name: 'Brian Davis', email: 'brian.davis@example.com' }
      }
    },
    'Maryland': {
      'iron-ridge': {
        name: 'Iron Ridge',
        address: '2950 Stone Gate Blvd, Elkton, MD 21921',
        unit: '175',
        vp: { name: 'Mark Anderson', email: 'mark.anderson@example.com' },
        rem: { name: 'Nancy Thompson', email: 'nancy.thompson@example.com' },
        rsd: { name: 'George Rodriguez', email: 'george.rodriguez@example.com' },
        ds: { name: 'Donna Martinez', email: 'donna.martinez@example.com' },
        pm: { name: 'Edward Wilson', email: 'edward.wilson@example.com' }
      }
    },
    'Ohio': {
      'millcroft': {
        name: 'Millcroft',
        address: '10 Commons Dr, Milford, OH 45150',
        unit: '202',
        vp: { name: 'Paul Lewis', email: 'paul.lewis@example.com' },
        rem: { name: 'Michelle Clark', email: 'michelle.clark@example.com' },
        rsd: { name: 'Kenneth Walker', email: 'kenneth.walker@example.com' },
        ds: { name: 'Laura Harris', email: 'laura.harris@example.com' },
        pm: { name: 'Steven Young', email: 'steven.young@example.com' }
      }
    },
    'Virginia': {
      'chesterfield-flats': {
        name: 'Chesterfield Flats',
        address: '100 Main Street, Richmond, VA 23235',
        unit: '168',
        vp: { name: 'Anthony Turner', email: 'anthony.turner@example.com' },
        rem: { name: 'Kimberly Moore', email: 'kimberly.moore@example.com' },
        rsd: { name: 'Donald Hill', email: 'donald.hill@example.com' },
        ds: { name: 'Sharon Scott', email: 'sharon.scott@example.com' },
        pm: { name: 'Ronald Adams', email: 'ronald.adams@example.com' }
      }
    },
    'Indiana': {
      'meridian-north': {
        name: 'The Meridian North',
        address: '2100 Westlane Rd, Indianapolis, IN 46260',
        unit: '185',
        vp: { name: 'Carol Evans', email: 'carol.evans@example.com' },
        rem: { name: 'Raymond King', email: 'raymond.king@example.com' },
        rsd: { name: 'Sandra White', email: 'sandra.white@example.com' },
        ds: { name: 'Jerry Wright', email: 'jerry.wright@example.com' },
        pm: { name: 'Deborah Green', email: 'deborah.green@example.com' }
      }
    }
  };
  
  try {
    console.log("Starting test data initialization...");
    for (const [state, properties] of Object.entries(testData)) {
      for (const [propertyId, propertyData] of Object.entries(properties)) {
        console.log(`Saving property: ${propertyId} in ${state}`);
        await savePropertyData(state, propertyId, propertyData);
      }
    }
    console.log('Test data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing test data:', error);
    throw error;
  }
};

// Call this function to initialize test data
// initializeTestData().then(() => console.log('Done!')); 