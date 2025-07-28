// --- Data for emotions ---
const emotions = [
    { name: "sad", img: "images/sad.jpeg" },
    { name: "loved", img: "images/loved.png" },
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
const resetButton = document.getElementById('reset-button');

// --- Functions ---

// Initializes click counts to zero and loads them from localStorage if available
function initializeCounts() {
    emotions.forEach(emotion => {
        clickCounts[emotion.name] = 0;
    });
    // Try to load saved counts from localStorage
    const savedCounts = localStorage.getItem('emotionClickCounts');
    if (savedCounts) {
        try {
            const parsedCounts = JSON.parse(savedCounts);
            for (const emotionName in parsedCounts) {
                if (clickCounts.hasOwnProperty(emotionName)) {
                    clickCounts[emotionName] = parsedCounts[emotionName];
                }
            }
        } catch (e) {
            console.error("Error parsing saved counts:", e);
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
    // Note: The 'clicked' class will remain. If you want it to flash or disappear,
    // you'd need to add a setTimeout to remove the class after a short delay.
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
    initializeCounts(); // Reset counts in memory
    saveCounts(); // Save cleared counts to localStorage
    updateClickCountsDisplay(); // Update the display
    // Remove 'clicked' class from all avatars
    Array.from(avatarsContainer.children).forEach(avatar => {
        avatar.classList.remove('clicked');
    });
}

// --- Event Listeners ---
resetButton.addEventListener('click', resetAllCounts);

// --- Initial setup when the page loads ---
document.addEventListener('DOMContentLoaded', () => {
    initializeCounts(); // Set up initial counts
    renderAvatars();    // Display the avatars
    updateClickCountsDisplay(); // Show initial counts
});
