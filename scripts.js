import { getPropertyDataByState } from "./firebaseService.js";

/**
 * Populate the placeholders in the existing HTML layout dynamically
 * @param {string} state - The state to fetch and display data for
 */
function populateDisplayPage(state) {
    // Fetch property data for the given state
    getPropertyDataByState(state, (properties) => {
        if (!properties) {
            console.error(`No property data available for ${state}.`);
            return;
        }

        // Iterate through properties and update placeholders
        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            for (const [role, details] of Object.entries(propertyDetails)) {
                // Construct the ID based on the property and role
                const id = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${role}`;
                const spanElement = document.getElementById(id);

                if (spanElement) {
                    if (role === "unitCount") {
                        // Update unit count as plain text
                        spanElement.textContent = details;
                    } else if (details.name && details.email) {
                        // Create the hyperlink with the role's ID
                        const linkId = id; // ID for the hyperlink (e.g., "westover-pointe-vp")
                    
                        // Update the element for the name
                        const nameElement = document.getElementById(`${id}-name`);
                        if (nameElement) {
                            nameElement.textContent = details.name;
                        }
                    
                        // Update the element for the email
                        const emailElement = document.getElementById(`${id}-email`);
                        if (emailElement) {
                            emailElement.textContent = details.email;
                        }
                    
                        // Add the hyperlink to the role's ID
                        spanElement.innerHTML = `
                            <a id="${linkId}" href="mailto:${details.email}">${details.name}</a>
                        `;
                    }                    
                }
            }
        }
    });
}

// Identify the state from the `data-state` attribute in the HTML
const mainElement = document.querySelector("main");
const state = mainElement ? mainElement.getAttribute("data-state") : null;

if (state) {
    window.onload = populateDisplayPage(state);
} else {
    console.error("State identifier not found in HTML.");
}
