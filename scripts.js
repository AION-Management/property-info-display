import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
import { app } from "./firebaseConfig.js";

const db = getDatabase(app);

function populateDisplayPage() {
    const propertiesRef = ref(db, "properties"); // Reference the root level "properties"
    
    onValue(propertiesRef, (snapshot) => {
        const states = snapshot.val();

        if (!states) {
            console.error("No data available.");
            return;
        }

        // Iterate through all states
        for (const [state, properties] of Object.entries(states)) {
            for (const [propertyName, propertyDetails] of Object.entries(properties)) {
                for (const [role, details] of Object.entries(propertyDetails)) {
                    const id = `${propertyName.toLowerCase().replace(/\s+/g, "-")}-${role}`; // Match the ID in HTML
                    const spanElement = document.getElementById(id);

                    if (spanElement) {
                        if (role === "unitCount") {
                            spanElement.textContent = details; // Display unit count as text
                        } else {
                            spanElement.innerHTML = `
                                <a href="mailto:${details.email}">${details.name}</a>
                            `; // Create hyperlink for name-email pairs
                        }
                    }
                }
            }
        }
    });
}

// Call the function to populate the display page
populateDisplayPage();
