
// Connect the 3 user posts to thir local storage key
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

// Update the post counter on the profile page
function updatePostCount() {

    const postCount = postButtons.filter(function(post) {
        return localStorage.getItem(post.storageKey) !== null;
    }).length;

    const postCountElement = document.querySelector(".userPosts p");

    if (postCountElement) {
        postCountElement.textContent = "Posts: " + postCount;
    }

}

// Keep track of which post the user wants to change with ths variable
let activePost = null;

// Create a file input element (file picker for images only)
const fileInput = document.createElement("input");

fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";

// Add the filepicker to HTML
document.body.appendChild(fileInput);


// Open the file explorer for a specific post and clear the old data
function openFileExplorer(post) {

    activePost = post;

    // Reset the input (so that the same image can be selected again)
    fileInput.value = "";

    fileInput.click();

}


// Display an image inside its postBox
function displayPostImage(post, imageData) {

    const postBox = post.button.parentElement;

    // Make the postBox a "positioning container"
    postBox.style.position = "relative";
    postBox.style.overflow = "hidden";

    // Check if theres allready an image in this b-word (box)
    let image = postBox.querySelector(".postImage");

    // Create the image if it doesn't exist and sets dimensions for the img
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

    // Set the imagr source
    image.src = imageData;


    // Check if the post already has an hover overlay
    let overlay = postBox.querySelector(".changeImageOverlay");

    // Here we create the hover overlay if it doesnt exist
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

        // Centre the text
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        // Overlay: background, text color, font size/wiehgt
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.color = "white";
        overlay.style.fontSize = "18px";
        overlay.style.fontWeight = "bold";

        // Init transparent
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

    // Hide the original pluss button
    post.button.style.display = "none";

}


// Load saved images from localStorage
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

    updatePostCount();

}


// Make the pluss buttons open the file explorer
postButtons.forEach(function(post) {

    if (!post.button) {
        return;
    }

    post.button.addEventListener("click", function() {

        openFileExplorer(post);

    });

});


// Event handler when user selects a file
fileInput.addEventListener("change", function() {

    const file = fileInput.files[0];

    // Check if a file was selected
    if (!file) {
        return;
    }

    // Make sure the selected image is an image
    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        fileInput.value = "";
        return;

    }

    // (For ctrl+f later, "noteToSelf:ID:f5k39hq22") Set max file size to 1mb and denies anything over it !Note if we change from local storage then we could try to increase file size but keep for now, ill ask K or if we care to we could maby try to fix after assignment!
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

    // Convert the image into Base64 format (For ctrl+f later, "noteToSelf:ID:m8p24vx71") Read up on this, dont fully understand base64 filereading yet
    const reader = new FileReader();
    reader.onload = function() {
        const imageData = reader.result;
        try {
            localStorage.setItem(currentPost.storageKey, imageData);
            updatePostCount();
            displayPostImage(currentPost, imageData);
        } catch (error) {
            alert("Could not save the image. Your browser's localStorage might be full.");
        }
        fileInput.value = "";
    };
    reader.onerror = function() {
        alert("Something went wrong while reading the image.");
        fileInput.value = "";
    };
    reader.readAsDataURL(file);
});

// Display saved images when the page loads
loadSavedImages();
