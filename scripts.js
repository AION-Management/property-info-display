import { getPropertyDataByState } from "./firebaseService.js";

/**
 * Populate the display page dynamically based on the state
 * @param {string} state - The state to fetch and display data for
 */
function populateDisplayPage(state) {
    const container = document.getElementById("container");

    // Set a fallback if the container is missing
    if (!container) {
        console.error("Container element not found.");
        return;
    }

    // Fetch property data for the state
    getPropertyDataByState(state, (properties) => {
        if (!properties) {
            console.error(`No property data available for ${state}.`);
            container.innerHTML = `<p>No data available for ${state}.</p>`;
            return;
        }

        container.innerHTML = ""; // Clear existing content

        // Iterate through properties and build the HTML
        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            const propertyDiv = document.createElement("div");
            propertyDiv.className = "property";

            // Create property name
            const propertyHeader = document.createElement("h2");
            propertyHeader.textContent = propertyName;
            propertyDiv.appendChild(propertyHeader);

            // Add property details
            for (const [role, details] of Object.entries(propertyDetails)) {
                const detailParagraph = document.createElement("p");

                if (role === "unitCount") {
                    detailParagraph.innerHTML = `<strong>${role.replace(/([A-Z])/g, " $1")}: </strong>${details}`;
                } else if (details.name && details.email) {
                    detailParagraph.innerHTML = `
                        <strong>${role.replace(/([A-Z])/g, " $1")}: </strong>
                        <a href="mailto:${details.email}">${details.name}</a>
                    `;
                }

                propertyDiv.appendChild(detailParagraph);
            }

            container.appendChild(propertyDiv);
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
