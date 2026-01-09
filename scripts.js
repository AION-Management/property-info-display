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
                const roleId = `${role}`;
                const candidateIds = [
                    roleId,
                    `${roleId}-name`,
                    `${roleId}-accountant-name`,
                    `${roleId}-email`
                ];

                let spanElement = null;
                let foundId = null;
                for (const cand of candidateIds) {
                    const el = document.getElementById(cand);
                    if (el) { spanElement = el; foundId = cand; break; }
                }

                if (!spanElement) {
                    console.warn(`Element for role "${role}" not found (tried: ${candidateIds.join(', ')}).`);
                    continue;
                }

                // Handle unit counts or numeric values
                if ((foundId && foundId.includes("unit")) || typeof details === 'number') {
                    if (details !== null && details !== undefined && details !== "") {
                        spanElement.textContent = details;
                    }
                    continue;
                }

                // If details is a simple string, just set it
                if (typeof details === 'string') {
                    spanElement.textContent = details;
                    continue;
                }

                // If details is an object with name/email, prefer creating a mailto link
                if (details && (details.name || details.email)) {
                    if (details.name && details.email) {
                        spanElement.innerHTML = `<a class="link" href="mailto:${details.email}">${details.name}</a>`;
                    } else if (details.name) {
                        spanElement.textContent = details.name;
                    } else if (details.email) {
                        spanElement.textContent = details.email;
                    }
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
