import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

const db = getDatabase();
const state = "Delaware"; // This page is specific to Delaware

function populateDisplayPage() {
    const stateRef = ref(db, `properties/${state}`);
    onValue(stateRef, (snapshot) => {
        const properties = snapshot.val();

        if (!properties) {
            console.error("No data available for this state.");
            return;
        }

        // Populate each property
        for (const [propertyName, propertyDetails] of Object.entries(properties)) {
            for (const [role, details] of Object.entries(propertyDetails)) {
                const id = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${role}`; // Match the ID in HTML
                const spanElement = document.getElementById(id);

                if (spanElement) {
                    if (role === "unitCount") {
                        spanElement.textContent = details;
                    } else {
                        spanElement.innerHTML = `
                            <a href="mailto:${details.email}">${details.name}</a>
                        `;
                    }
                }
            }
        }
    });
}

// Call the function to populate the display page
populateDisplayPage();
