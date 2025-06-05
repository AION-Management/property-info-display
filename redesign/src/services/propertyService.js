/**
 * Property Service - Firebase Data Layer for Property Management
 * 
 * This service handles all property-related data operations with Firebase Realtime Database.
 * It provides a clean API for frontend components to interact with property data.
 * 
 * Key Responsibilities:
 * - Property data CRUD operations with Firebase
 * - Data format mapping between Firebase structure and frontend needs
 * - Property ID normalization and mapping
 * - State name format consistency
 * - Error handling and fallback data for development
 * 
 * Data Architecture:
 * Firebase Structure: properties/{StateName}/{propertyName}
 * Frontend Structure: properties/{stateId}/{propertyId}
 */

import { ref, set, onValue, get } from "firebase/database";
import { database } from "./firebase";

/**
 * Property ID Mapping Table
 * 
 * Maps frontend property URLs to Firebase property keys.
 * This allows clean URLs while maintaining Firebase data structure compatibility.
 * URL format: /property/state/property-name-with-dashes
 * Firebase format: properties/StateName/propertyKey
 */
const propertyIdMapping = {
  // Delaware properties
  'westover-pointe': 'westover-pointe',
  'hunters-crossing': 'hunters-crossing',
  'liberty-pointe': 'liberty-pointe',
  
  // Indiana properties
  'meridian-south': 'meridian-south',
  'meridian-north': 'meridian-north',
  
  // Maryland properties
  'iron-ridge': 'iron-ridge',
  'landmark-glen-station': 'landmark',
  'mariners-pointe': 'mariners-pointe',
  'metro-pointe': 'metro-pointe',
  'scotland-heights': 'scotland-heights',
  'stonegate-iron-ridge': 'stonegate',
  'the-flats': 'flats',
  'the-ridge': 'ridge',
  'yorkshire-apartments': 'yorkshire',
  
  // New Jersey properties
  'aspen-court': 'aspen-court',
  'cherry-hill-towers': 'cherry-hill-towers',
  'fox-pointe': 'fox-pointe',
  'haven-new-providence': 'haven',
  'holly-court': 'holly-court',
  'joralemon': 'joralemon',
  'orchard-park': 'orchard-park',
  'overlook-at-flanders': 'overlook',
  'parc-at-cherry-hill': 'parcCherry',
  'parc-at-lyndhurst': 'parcLyn',
  'parc-at-maplewood-station': 'parcMaple',
  'parc-at-roxbury': 'parcRox',
  'silverlake': 'silverlake',
  'the-brunswick': 'brunswick',
  'the-colony-at-chews-landing': 'colony',
  'the-george-new-brunswick': 'georgeNB',
  'the-monroe': 'monroe',
  'the-woodlands': 'woodlands',
  
  // Ohio properties
  'millcroft': 'millcroft',
  'pointe-at-northern-woods': 'pointeNW',
  'ponderosa': 'ponderosa',
  'reserves-at-arlington': 'reserves-arlington',
  'reserves-at-northern-woods': 'reservesNW',
  
  // Pennsylvania properties
  '1869-west': '1869west',
  '214-vine': '214vine',
  'aston-pointe': 'aston-pointe',
  'cheltenham-station': 'cheltenham-station',
  'cosmopolitan': 'cosmopolitan',
  'franklin-commons': 'franklin-commons',
  'greenspring': 'greenspring',
  'lehigh-square': 'lehigh',
  'lehigh-square-b': 'lehigh-B',
  'metal-works': 'metal-works',
  'parc-at-west-pointe': 'parcWest',
  'river-oaks': 'river-oaks',
  'river-pointe': 'river-pointe',
  'springhouse-townhomes': 'springhouse',
  'terminal-21': 'terminal21',
  'the-addison': 'addison',
  'the-alden': 'alden',
  'the-commons': 'commons',
  'the-nolan': 'nolan',
  'the-residence-at-st-josephs': 'residence-josephs',
  'the-view-at-north-hills': 'viewNorth',
  'the-wellington': 'wellington',
  'valley-park': 'valley-park',
  
  // Virginia properties
  'chesterfield-flats': 'chesterfield-flats',
  'chesapeake-pointe': 'chesapeake-pointe',
  'harborstone': 'harborstone',
  'james-river-pointe': 'james-river-pointe', 
  'pointe-at-river-city': 'pointe-river-city',
  'reserves-at-tidewater': 'reserves-tidewater'
};

/**
 * State Mapping Table
 * 
 * Maps frontend state IDs to Firebase state names.
 * Ensures consistency between URL routing and database structure.
 */
const stateMapping = {
  'newJersey': 'New Jersey',
  'delaware': 'Delaware',
  'indiana': 'Indiana',
  'maryland': 'Maryland',
  'ohio': 'Ohio',
  'pennsylvania': 'Pennsylvania',
  'virginia': 'Virginia'
};

/**
 * Save Property Data to Firebase
 * 
 * Stores property information in Firebase Realtime Database.
 * Used primarily by the admin interface for data management.
 * 
 * @param {string} state - The state name (e.g., "Delaware")
 * @param {string} property - The property id (e.g., "westover-pointe")
 * @param {object} propertyData - Complete property details object
 * @returns {Promise<boolean>} Success indicator
 */
export const savePropertyData = (state, property, propertyData) => {
  const propertyRef = ref(database, `properties/${state}/${property}`);
  return set(propertyRef, propertyData)
    .then(() => {
      console.log(`Property data for ${property} in ${state} saved successfully.`);
      return true;
    })
    .catch((error) => {
      console.error("Error saving property data:", error);
      throw error;
    });
};

/**
 * Process Property Data from Firebase to Frontend Format
 * 
 * Transforms raw Firebase property data into the standardized format
 * expected by frontend components. Handles missing fields gracefully
 * and extracts contact information from staff roles.
 * 
 * @param {string} propertyName - Property name from Firebase
 * @param {object} propertyDetails - Raw property data from Firebase
 * @returns {object} Formatted property object for frontend consumption
 */
const processPropertyData = (propertyName, propertyDetails) => {
  // Create URL-friendly property ID from name
  const propertyId = propertyName.toLowerCase().replace(/\s+/g, "-");
  
  // Extract staff information from Firebase roles structure
  const vp = propertyDetails.vp || {};
  const rem = propertyDetails.rem || {};
  const rsd = propertyDetails.rsd || {};
  const ds = propertyDetails.ds || {};
  const pm = propertyDetails.pm || {};
  
  return {
    id: propertyId,
    name: propertyName,
    address: propertyDetails.address || '',
    description: propertyDetails.description || '',
    units: propertyDetails.unit || '',
    yearBuilt: propertyDetails.yearBuilt || '',
    renovated: propertyDetails.renovated || '',
    amenities: propertyDetails.amenities || [],
    // Primary contact information (usually property manager)
    contact: {
      manager: (pm && pm.name) || '',
      phone: propertyDetails.phone || '',
      email: (pm && pm.email) || ''
    },
    // Complete staff directory organized by role
    staff: {
      vp: { name: (vp && vp.name) || '', email: (vp && vp.email) || '' },
      rem: { name: (rem && rem.name) || '', email: (rem && rem.email) || '' },
      rsd: { name: (rsd && rsd.name) || '', email: (rsd && rsd.email) || '' },
      ds: { name: (ds && ds.name) || '', email: (ds && ds.email) || '' },
      pm: { name: (pm && pm.name) || '', email: (pm && pm.email) || '' }
    },
    images: propertyDetails.images || ['/logo.png'] // Fallback to logo if no images
  };
};

/**
 * Get All Properties Data
 * 
 * Fetches complete property dataset from Firebase and formats it for frontend consumption.
 * Used by the Home page to display all properties organized by state.
 * 
 * @returns {Promise<object>} Promise resolving to complete property dataset
 * Structure: { stateId: { propertyId: propertyObject } }
 */
export const getAllProperties = () => {
  return new Promise((resolve, reject) => {
    const propertiesRef = ref(database, "properties");
    
    onValue(
      propertiesRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Process the data to match the expected structure in the frontend
          const rawData = snapshot.val();
          const processedData = {};
          
          // Convert Firebase structure to frontend-expected format
          for (const [state, stateProperties] of Object.entries(rawData)) {
            // Normalize state name to lowercase for consistent routing
            const stateKey = state.toLowerCase();
            processedData[stateKey] = {};
            
            // Process each property within the state
            for (const [propertyName, propertyDetails] of Object.entries(stateProperties)) {
              const formattedProperty = processPropertyData(propertyName, propertyDetails);
              processedData[stateKey][formattedProperty.id] = formattedProperty;
            }
          }
          
          resolve(processedData);
        } else {
          resolve({}); // Return empty object if no data exists
        }
      },
      (error) => {
        reject(error);
      },
      { onlyOnce: true } // Single read, not real-time updates
    );
  });
};

/**
 * Get Properties by State
 * 
 * Fetches all properties for a specific state. Used by StatePage component
 * to display properties filtered by state selection.
 * 
 * @param {string} state - The state id (e.g., "delaware")
 * @returns {Promise<object>} Promise resolving to state's property data
 * Structure: { propertyId: propertyObject }
 */
export const getPropertiesByState = (state) => {
  return new Promise((resolve, reject) => {
    // Map frontend state ID to Firebase state name format
    const formattedState = stateMapping[state] || state;
    
    const stateRef = ref(database, `properties/${formattedState}`);
    
    onValue(
      stateRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // Process the data to match the expected structure in the frontend
          const rawData = snapshot.val();
          const processedData = {};
          
          // Format each property in the state
          for (const [propertyName, propertyDetails] of Object.entries(rawData)) {
            const formattedProperty = processPropertyData(propertyName, propertyDetails);
            processedData[formattedProperty.id] = formattedProperty;
          }
          
          resolve(processedData);
        } else {
          resolve({}); // Return empty object if state has no properties
        }
      },
      (error) => {
        reject(error);
      },
      { onlyOnce: true } // Single read, not real-time updates
    );
  });
};

/**
 * Get Specific Property Details
 * 
 * Fetches detailed information for a single property. Used by PropertyDetail component
 * to display comprehensive property information including staff contacts and amenities.
 * 
 * Includes development fallback with mock data when Firebase data is unavailable.
 * 
 * @param {string} state - The state id (e.g., "delaware")
 * @param {string} propertyId - The property id (e.g., "westover-pointe")
 * @returns {Promise<object|null>} Promise resolving to property details or null if not found
 */
export const getPropertyDetails = (state, propertyId) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Fetching property details for: state=${state}, propertyId=${propertyId}`);
      
      // Map frontend property ID to Firebase property key if mapping exists
      const mappedPropertyId = propertyIdMapping[propertyId] || propertyId;
      console.log(`Mapped property ID: ${mappedPropertyId}`);
      
      // Map frontend state ID to Firebase state name format
      const formattedState = stateMapping[state] || state;
      console.log(`Formatted state: ${formattedState}`);
      
      // Construct Firebase database path
      const path = `properties/${formattedState}/${mappedPropertyId}`;
      console.log(`Firebase path: ${path}`);
      
      // Get Firebase reference and fetch data
      const propertyRef = ref(database, path);
      
      get(propertyRef)
        .then((snapshot) => {
          console.log(`Snapshot exists: ${snapshot.exists()}`);
          
          if (snapshot.exists()) {
            const propertyData = snapshot.val();
            console.log('Property data retrieved:', propertyData);
            
            // Generate display name from property ID if not provided
            const propertyName = mappedPropertyId.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            
            // Format the property data for frontend consumption
            const formattedProperty = {
              id: propertyId,
              name: propertyData.name || propertyName,
              address: propertyData.address || '',
              description: propertyData.description || '',
              units: propertyData.unit || '',
              yearBuilt: propertyData.yearBuilt || '',
              renovated: propertyData.renovated || '',
              amenities: propertyData.amenities || [],
              contact: {
                manager: (propertyData.pm && propertyData.pm.name) || '',
                phone: propertyData.phone || '',
                email: (propertyData.pm && propertyData.pm.email) || ''
              },
              // Complete staff directory with safe property access
              staff: {
                vp: { 
                  name: (propertyData.vp && propertyData.vp.name) || '', 
                  email: (propertyData.vp && propertyData.vp.email) || '' 
                },
                rem: { 
                  name: (propertyData.rem && propertyData.rem.name) || '', 
                  email: (propertyData.rem && propertyData.rem.email) || '' 
                },
                rsd: { 
                  name: (propertyData.rsd && propertyData.rsd.name) || '', 
                  email: (propertyData.rsd && propertyData.rsd.email) || '' 
                },
                ds: { 
                  name: (propertyData.ds && propertyData.ds.name) || '', 
                  email: (propertyData.ds && propertyData.ds.email) || '' 
                },
                pm: { 
                  name: (propertyData.pm && propertyData.pm.name) || '', 
                  email: (propertyData.pm && propertyData.pm.email) || '' 
                }
              },
              images: propertyData.images || ['/logo.png']
            };
            
            resolve(formattedProperty);
          } else {
            console.warn(`No data found at path: ${path}`);
            
            // Development fallback - provide mock data for testing
            if (process.env.NODE_ENV !== 'production') {
              console.log('Returning mock property data for development');
              const mockProperty = {
                id: propertyId,
                name: propertyId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                address: '123 Main St, City, State 12345',
                description: 'This is a sample property description. Real data needs to be loaded via the Admin page.',
                units: '100',
                yearBuilt: '2010',
                renovated: '2020',
                amenities: ['Swimming Pool', 'Fitness Center', 'Pet Friendly'],
                contact: {
                  manager: 'John Doe',
                  phone: '(555) 123-4567',
                  email: 'john.doe@example.com'
                },
                staff: {
                  vp: { name: 'Jane Smith', email: 'jane.smith@example.com' },
                  rem: { name: 'Robert Johnson', email: 'robert.johnson@example.com' },
                  rsd: { name: 'Emily Davis', email: 'emily.davis@example.com' },
                  ds: { name: 'Michael Wilson', email: 'michael.wilson@example.com' },
                  pm: { name: 'Sarah Thompson', email: 'sarah.thompson@example.com' }
                },
                images: ['/logo.png']
              };
              resolve(mockProperty);
            } else {
              resolve(null); // Return null in production if no data exists
            }
          }
        })
        .catch((error) => {
          console.error(`Error fetching property data: ${error.message}`);
          reject(error);
        });
    } catch (error) {
      console.error(`Unexpected error in getPropertyDetails: ${error.message}`);
      reject(error);
    }
  });
}; 