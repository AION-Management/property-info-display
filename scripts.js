import { getPropertyDataByState } from "./firebaseService.js";

function populateDisplayPage(state) {
    console.log("Fetching data for state:", state);

    getPropertyDataByState(state, (properties) => {
        console.log(`Properties for ${state}:`, properties);

        if (!properties) {
            console.error(`No property data available for ${state}.`);
            return;
        }

        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            for (const [role, details] of Object.entries(propertyDetails)) {
                //console.log(`Role: ${role}`);
                //const id = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${role}`;
                const id = `${role}`;
                console.log(`Looking for element with ID: ${id}`);

                const spanElement = document.getElementById(id);

                if (!spanElement) {
                    console.warn(`Element with ID "${id}" not found.`);
                    continue;
                }

                if (role === "unitCount") {
                    if (details !== null && details !== undefined && details !== "") {
                        spanElement.textContent = details;
                    }
                } else if (details && details.name && details.email) {
                    const nameElement = document.getElementById(`${id}-name`);
                    const emailElement = document.getElementById(`${id}-email`);

                    if (nameElement && details.name) {
                        nameElement.textContent = details.name;
                    } else {
                        console.warn(`Name element with ID "${id}-name" not found.`);
                    }

                    if (emailElement && details.email) {
                        emailElement.textContent = details.email;
                    } else {
                        console.warn(`Email element with ID "${id}-email" not found.`);
                    }

                    if (details.name && details.email) {
                        spanElement.innerHTML = `<a id="${id}" href="mailto:${details.email}">${details.name}</a>`;
                    }
                    // Add the hyperlink to the role's ID
                    //spanElement.innerHTML = `<a id="${id}" href="mailto:${details.email}">${details.name}</a>`;
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const mainElement = document.querySelector("main");
    const state = mainElement ? mainElement.getAttribute("data-state") : null;

    if (state) {
        populateDisplayPage(state);
    } else {
        console.error("State identifier not found in HTML.");
    }
});
