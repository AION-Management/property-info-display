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
                        // Update name with a mailto hyperlink
                        spanElement.innerHTML = `
                            <a href="mailto:${details.email}">${details.name}</a>
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
    populateDisplayPage(state);
} else {
    console.error("State identifier not found in HTML.");
}
