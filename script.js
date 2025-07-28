// --- Data for emotions ---
const emotions = [
    { name: "sad", img: "images/sad.jpeg" },
    { name: "loved", img: "images/loved.jpeg" },
    { name: "angry", img: "images/angry.png" },
    { name: "relaxed", img: "images/relaxed.png" },
    { name: "sleepy", img: "images/sleepy.png" },
    { name: "sick", img: "images/sick.png" },
    { name: "happy", img: "images/happy.png" },
    { name: "excited", img: "images/excited.png" }
];

// --- Global variables ---
let clickCounts = {}; // Stores the count for each emotion
const avatarsContainer = document.getElementById('avatars-container');
const clickCountsDisplay = document.getElementById('click-counts');
const resetButton = document.getElementById('reset-button'); // Ensure this is correctly grabbed

// --- Functions ---

// Initializes click counts to zero and loads them from localStorage if available
function initializeCounts() {
    emotions.forEach(emotion => {
        clickCounts[emotion.name] = 0; // Default to 0
    });
    // Try to load saved counts from localStorage
    const savedCounts = localStorage.getItem('emotionClickCounts');
    if (savedCounts) {
        try {
            const parsedCounts = JSON.parse(savedCounts);
            // Only update counts for emotions that exist in our current 'emotions' list
            for (const emotionName in parsedCounts) {
                if (clickCounts.hasOwnProperty(emotionName)) { // Check if emotion exists
                    clickCounts[emotionName] = parsedCounts[emotionName];
                }
            }
        } catch (e) {
            console.error("Error parsing saved counts from localStorage:", e);
        }
    }
}

// Saves current click counts to localStorage
function saveCounts() {
    localStorage.setItem('emotionClickCounts', JSON.stringify(clickCounts));
}

// Renders the emotion avatars on the page
function renderAvatars() {
    avatarsContainer.innerHTML = ''; // Clear existing avatars
    emotions.forEach(emotion => {
        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('avatar');
        avatarDiv.dataset.emotion = emotion.name; // Store emotion name as a data attribute

        const img = document.createElement('img');
        img.src = emotion.img;
        img.alt = `${emotion.name} avatar`;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('avatar-name');
        nameSpan.textContent = emotion.name;

        avatarDiv.appendChild(img);
        avatarDiv.appendChild(nameSpan);

        // Add click event listener to each avatar
        avatarDiv.addEventListener('click', () => handleAvatarClick(emotion.name, avatarDiv));
        avatarsContainer.appendChild(avatarDiv);
    });
}

// Handles a click on an avatar
function handleAvatarClick(emotionName, avatarElement) {
    clickCounts[emotionName]++; // Increment the count for this emotion
    saveCounts(); // Save updated counts
    updateClickCountsDisplay(); // Update the display
    avatarElement.classList.add('clicked'); // Add visual feedback for being clicked
}

// Updates the display of click counts
function updateClickCountsDisplay() {
    clickCountsDisplay.innerHTML = ''; // Clear previous counts
    emotions.forEach(emotion => {
        const countItem = document.createElement('div');
        countItem.classList.add('count-item');
        countItem.innerHTML = `
            <span>${emotion.name.charAt(0).toUpperCase() + emotion.name.slice(1)}:</span>
            <span class="count-value">${clickCounts[emotion.name]}</span>
        `;
        clickCountsDisplay.appendChild(countItem);
    });
}

// Resets all counts to zero
function resetAllCounts() {
    console.log("Reset button clicked! Resetting counts..."); // Console log for debugging
    emotions.forEach(emotion => {
        clickCounts[emotion.name] = 0; // Reset counts in memory to 0
    });
    saveCounts(); // Save cleared counts to localStorage
    updateClickCountsDisplay(); // Update the display to show 0s

    // Remove 'clicked' class from all avatars
    // This part ensures the blue border is removed from all avatar elements on the page
    Array.from(document.querySelectorAll('.avatar')).forEach(avatar => {
        avatar.classList.remove('clicked');
    });
}

// --- Event Listeners ---
// Make sure the resetButton variable is correctly linked before adding the listener
if (resetButton) {
    resetButton.addEventListener('click', resetAllCounts);
} else {
    console.error("Reset button element not found!");
}


// --- Initial setup when the page loads ---
document.addEventListener('DOMContentLoaded', () => {
    initializeCounts(); // Set up initial counts (from localStorage or 0)
    renderAvatars();    // Display the avatars
    updateClickCountsDisplay(); // Show initial counts
});
