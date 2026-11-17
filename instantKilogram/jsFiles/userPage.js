
import { userInfo } from "/jsFiles/userInfo.js";

//Automatic follower growth !NOTE! src:m4p82fb73 (Wanna go back and remove this, its a very lazy workaround. Wanna make it so that after a certain amount of post's you get affection to 100% and the bot follows you. Then you would be able to see who follows you + you wouldnt end up with 10000 followers while testing and coding the project xd)

const FOLLOWER_STORAGE_KEY = "savedUserFollowers";
const FOLLOWER_TIME_KEY = "savedUserFollowersLastUpdate";

// Calculate and update the follower count
const FOLLOWER_INTERVAL = 10 * 60 * 1000; // 10 minnutes

function getUserFollowerCount() {

    const savedFollowers = localStorage.getItem(FOLLOWER_STORAGE_KEY);

    // First visit init
    let followers;

    if (savedFollowers === null) {

        followers = Number(userInfo.userFollowers) || 0;

        localStorage.setItem(FOLLOWER_STORAGE_KEY, followers);
        localStorage.setItem(FOLLOWER_TIME_KEY, Date.now());

        return followers;
    }

    followers = Number(savedFollowers);

    if (!Number.isFinite(followers) || followers < 0) {
        followers = 0;
    }

    // Timestamp retrieval from localStorage (for checking when the last update was)
    let lastUpdate = Number(localStorage.getItem(FOLLOWER_TIME_KEY));

    if (!Number.isFinite(lastUpdate) || lastUpdate <= 0) {

        localStorage.setItem(FOLLOWER_TIME_KEY, Date.now());

        return followers;
    }

    // Calculate how many 10 minutes has gone by
    const elapsedIntervals = Math.floor(
        (Date.now() - lastUpdate) / FOLLOWER_INTERVAL
    );

    // Increase followers for every 10 minutes passed
    if (elapsedIntervals > 0) {

        for (let i = 0; i < elapsedIntervals; i++) {

            const randomFollowers = Math.floor(Math.random() * 3) + 1;

            followers += randomFollowers;

        }

        // Save count to localStorage
        localStorage.setItem(FOLLOWER_STORAGE_KEY, followers);

        // update last timestamp while preserving the schedule
        localStorage.setItem(
            FOLLOWER_TIME_KEY,
            lastUpdate + elapsedIntervals * FOLLOWER_INTERVAL
        );

    }

    return followers;
}


// Schedule the next update
function scheduleFollowerGrowth() {

    const lastUpdate = Number(localStorage.getItem(FOLLOWER_TIME_KEY));

    const elapsedTime = Date.now() - lastUpdate;

    const timeUntilNextUpdate = Math.max(
        1000,
        FOLLOWER_INTERVAL - elapsedTime
    );

    setTimeout(function() {

        const followers = getUserFollowerCount();

        const followerElement = document.querySelector(".userFollowers p");

        if (followerElement) {
            followerElement.textContent = "Followers: " + followers;
        }

        // I run ts
        scheduleFollowerGrowth();

    }, timeUntilNextUpdate);

}

// Count how many bots the user follows
function getFollowingCount() {

    const botIds = [
        "tyra",
        "jesper",
        "marit",
        "maria",
        "kristina"
    ];

    const followingCount = botIds.filter(function(botId) {

        return localStorage.getItem(`bot_${botId}_followed`) === "true";

    }).length;

    return followingCount;
}   

// Display user information
function displayUserInfo() {
    // Profile picture
    const profilePicturePlacement = document.querySelector("#profilePicturePlacement");
    const profilePicImg = document.createElement("img");
    profilePicImg.setAttribute("style", "border-radius: 50%;");

    profilePicImg.src = localStorage.getItem("savedProfilePic") || userInfo.profilePicture;
    profilePicImg.alt = "Your profile picture";
    profilePicturePlacement.replaceChildren(profilePicImg);

    // Username
    const userNamePlacement = document.querySelector(".userName");
    const userNameInfo = document.createElement("h2");

    userNameInfo.textContent = localStorage.getItem("savedUsername") ?? userInfo.name;
    userNamePlacement.replaceChildren(userNameInfo);

    // User stats
    const postStorageKeys = [
    "userPagePostImage1",
    "userPagePostImage2",
    "userPagePostImage3"
    ];

    const postCount = postStorageKeys.filter(function(key) {
        return localStorage.getItem(key) !== null;
    }).length;

    // Display the users post count
    document.querySelector(".userPosts p").textContent =
        "Posts: " + postCount;

    document.querySelector(".userFollowers p").textContent =
    "Followers: " + getUserFollowerCount();

    document.querySelector(".userFollowing p").textContent =
        "Following: " + getFollowingCount();

    // Bio
    const userBioPlacement = document.querySelector(".userBio");
    const userBioInfo = document.createElement("p");

    userBioInfo.textContent = localStorage.getItem("savedBio") ?? userInfo.bio;
    userBioPlacement.replaceChildren(userBioInfo);
}


// Initial display
displayUserInfo();

// Start automatic follower growth
scheduleFollowerGrowth();


// Modal buttons (for the profile settings tab)
const settingsDialog = document.querySelector("#settingsDialog");
const showModalButton = document.querySelector("#showModalButton");
const hideModalButton = document.querySelector("#hideModalButton");

showModalButton.addEventListener("click", () => {
    settingsDialog.showModal();
});

hideModalButton.addEventListener("click", () => {
    settingsDialog.close();
});


// Settings elements
const settingsForm = document.querySelector("#settingsForm");
const modalUsernameInput = document.querySelector("#modalUsernameInput");
const modalBioInput = document.querySelector("#modalBioInput");
const modalFileInput = document.querySelector("#modalFileInput");
const savedImagePreview = document.querySelector("#savedImagePreview");
const statusMessage = document.querySelector("#statusMessage");


// Load previously saved information into th eform
function loadSavedSettings() {

    modalUsernameInput.value = localStorage.getItem("savedUsername") ?? "";
    modalBioInput.value = localStorage.getItem("savedBio") ?? "";

    const savedImage = localStorage.getItem("savedProfilePic");

    if (savedImage) {
        savedImagePreview.src = savedImage;
        savedImagePreview.style.display = "block";

        statusMessage.textContent = "Loaded profile picture from memory";
    }

    // Preview newly selected image (before submitting)
    modalFileInput.addEventListener("change", () => {
        const file = modalFileInput.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();

            img.onload = function() {
                if (img.width > 500 || img.height > 500) {
                    alert("Image must be maximum 500x500 pixels!");
                    modalFileInput.value = "";
                    return;
                }

                savedImagePreview.src = event.target.result;
                savedImagePreview.style.display = "block";
                statusMessage.textContent = "Preview ready – submit to save!";
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });
};

loadSavedSettings();


// Save username, bio and optional picture
function saveProfileChanges(base64String = null) {

    try {
        // Save picture if a new one was uploaded
        if (base64String !== null) {
            localStorage.setItem("savedProfilePic", base64String);
        }

        // Save username and bio
        localStorage.setItem("savedUsername", modalUsernameInput.value);
        localStorage.setItem("savedBio", modalBioInput.value);

        // Update profile picture preview
        if (base64String !== null) {
            savedImagePreview.src = base64String;
            savedImagePreview.style.display = "block";
        }

        // Update the actual profile
        displayUserInfo();

        statusMessage.textContent = "Changes saved successfully!";

        settingsDialog.close();

    } catch (error) {
        alert("Could not save your changes: " + error.message);
        console.error(error);
    }
}


// Form submission event handler startup (markiplier refference)
settingsForm.addEventListener("submit", (e) => {

    e.preventDefault();

    // Check whether a new image was selected
    const file = modalFileInput.files[0];

    // No new image: save username and bio only
    if (!file) {
        saveProfileChanges();
        return;
    }

    // Check image file type
    if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert("Only PNG and JPG images are supported!");
        return;
    }

    // Check image file size (under 5 MB)
    if (file.size >= 5 * 1024 * 1024) {
        alert("Image must be smaller than 5 MB!");
        return;
    }

    // Convert image to Base64 !NOTE! ref:z2k91rx56 (base64 is not fully clicking for me so go back and add comments here when I understand it fully)
    const reader = new FileReader();

    reader.onload = function(event) {
        const base64String = event.target.result;
        const img = new Image();
        img.onload = function() {
            if (img.width > 500 || img.height > 500) {
                alert("Image must be maximum 500x500 pixels!");
                return;
            }
            saveProfileChanges(base64String);
        };
        img.onerror = function() {
            alert("Could not read the selected image!");
        };
        img.src = base64String;
    };
    reader.onerror = function() {
        alert("Something went wrong while reading the image!");
    };
    reader.readAsDataURL(file);
});
