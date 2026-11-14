
import { userInfo } from "/jsFiles/userInfo.js";

// Display user information
function displayUserInfo() {
    // Profile picture
    const profilePicturePlacement = document.querySelector("#profilePicturePlacement");
    const profilePicImg = document.createElement("img");

    profilePicImg.src = localStorage.getItem("savedProfilePic") || userInfo.profilePicture;
    profilePicturePlacement.replaceChildren(profilePicImg);

    // Username
    const userNamePlacement = document.querySelector(".userName");
    const userNameInfo = document.createElement("h2");

    userNameInfo.textContent = localStorage.getItem("savedUsername") ?? userInfo.name;
    userNamePlacement.replaceChildren(userNameInfo);

    // User stats
    document.querySelector(".userPosts p").textContent =
        "Posts: " + userInfo.userPosts;

    document.querySelector(".userFollowers p").textContent =
        "Followers: " + userInfo.userFollowers;

    document.querySelector(".userFollowing p").textContent =
        "Following: " + userInfo.userFollowing;

    // Bio
    const userBioPlacement = document.querySelector(".userBio");
    const userBioInfo = document.createElement("p");

    userBioInfo.textContent = localStorage.getItem("savedBio") ?? userInfo.bio;
    userBioPlacement.replaceChildren(userBioInfo);
}


// Initial display
displayUserInfo();


// Modal buttons
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


// Load previously saved information
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


// Form submission
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

    // Convert image to Base64
    const reader = new FileReader();

    reader.onload = function(event) {

        const base64String = event.target.result;
        const img = new Image();

        img.onload = function() {

            // Check image dimensions
            if (img.width > 500 || img.height > 500) {
                alert("Image must be maximum 500x500 pixels!");
                return;
            }

            // Everything is valid: save changes
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
