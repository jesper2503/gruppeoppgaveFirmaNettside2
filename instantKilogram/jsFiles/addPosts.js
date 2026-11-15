
// Get the three post buttons from the HTML
const postButtons = [
    {
        button: document.getElementById("post1"),
        storageKey: "userPagePostImage1"
    },
    {
        button: document.getElementById("post2"),
        storageKey: "userPagePostImage2"
    },
    {
        button: document.getElementById("post3"),
        storageKey: "userPagePostImage3"
    }
];

// Keep track of which post the user wants to change
let activePost = null;

// Create a file input element
const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";

// Add the file input to the HTML
document.body.appendChild(fileInput);


// Open the file explorer for a specific post
function openFileExplorer(post) {

    activePost = post;

    // Reset the input so the same image can be selected again
    fileInput.value = "";

    fileInput.click();

}


// Display an image inside its postBox
function displayPostImage(post, imageData) {

    const postBox = post.button.parentElement;

    // Make the postBox a positioning container
    postBox.style.position = "relative";
    postBox.style.overflow = "hidden";

    // Check if the post already has an image
    let image = postBox.querySelector(".postImage");

    // Create the image if it doesn't exist
    if (!image) {

        image = document.createElement("img");

        image.className = "postImage";
        image.alt = "Uploaded post image";

        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
        image.style.display = "block";

        postBox.appendChild(image);

    }

    // Set the image source
    image.src = imageData;


    // Check if the post already has a hover overlay
    let overlay = postBox.querySelector(".changeImageOverlay");

    // Create the hover overlay if it doesn't exist
    if (!overlay) {

        overlay = document.createElement("div");

        overlay.className = "changeImageOverlay";
        overlay.textContent = "Change image";

        // Position the overlay over the image
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";

        // Center the text
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        // Overlay appearance
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.color = "white";
        overlay.style.fontSize = "18px";
        overlay.style.fontWeight = "bold";

        // Hide the overlay until the user hovers
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.2s";

        overlay.style.cursor = "pointer";

        postBox.appendChild(overlay);


        // Darken the image and show the text when hovering
        overlay.addEventListener("mouseenter", function() {

            overlay.style.opacity = "1";
            image.style.filter = "brightness(0.65)";

        });


        // Restore the image when the mouse leaves
        overlay.addEventListener("mouseleave", function() {

            overlay.style.opacity = "0";
            image.style.filter = "brightness(1)";

        });


        // Open the file explorer when clicking the image
        overlay.addEventListener("click", function() {

            openFileExplorer(post);

        });

    }

    // Hide the original plus button
    post.button.style.display = "none";

}


// Load previously saved images from localStorage
function loadSavedImages() {

    postButtons.forEach(function(post) {

        if (!post.button) {
            return;
        }

        const savedImage = localStorage.getItem(post.storageKey);

        if (savedImage) {

            displayPostImage(post, savedImage);

        }

    });

}


// Make the plus buttons open the file explorer
postButtons.forEach(function(post) {

    if (!post.button) {
        return;
    }

    post.button.addEventListener("click", function() {

        openFileExplorer(post);

    });

});


// Handle the selected image
fileInput.addEventListener("change", function() {

    const file = fileInput.files[0];

    // Check if a file was selected
    if (!file) {
        return;
    }

    // Make sure the selected file is an image
    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        fileInput.value = "";
        return;

    }

    // Maximum file size: 1 MB
    const maximumFileSize = 1024 * 1024;

    if (file.size > maximumFileSize) {

        alert("The image must be smaller than 1 MB.");

        fileInput.value = "";
        return;

    }

    // Remember which post is being updated
    const currentPost = activePost;

    if (!currentPost) {
        return;
    }

    // Convert the image into Base64 format
    const reader = new FileReader();

    reader.onload = function() {

        const imageData = reader.result;

        try {

            // Save the image in localStorage
            localStorage.setItem(currentPost.storageKey, imageData);

            // Display the new image
            // This also replaces the previous image
            displayPostImage(currentPost, imageData);

        } catch (error) {

            alert("Could not save the image. Your browser's localStorage might be full.");

        }

        // Reset the file input
        fileInput.value = "";

    };

    reader.onerror = function() {

        alert("Something went wrong while reading the image.");

        fileInput.value = "";

    };

    // Read the image as a Base64 data URL
    reader.readAsDataURL(file);

});


// Display saved images when the page loads
loadSavedImages();
