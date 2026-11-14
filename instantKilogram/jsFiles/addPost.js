console.log("addPosts.js is running!");

const postButtonIds = ["post1", "post2", "post3"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

postButtonIds.forEach((buttonId, index) => {
    const button = document.getElementById(buttonId);
    if (!button) {
        console.warn(`Button with id "${buttonId}" not found.`);
        return;
    }

    const postBox = button.parentElement;
    const storageKey = `savedPostImage_${index + 1}`;

    // 1. Load saved image from localStorage on startup
    const existingImageData = localStorage.getItem(storageKey);
    if (existingImageData) {
        displayImageInBox(postBox, existingImageData, storageKey);
    }

    // 2. Attach click listener directly
    button.addEventListener("click", (e) => {
        e.preventDefault();
        openFileSelector(postBox, storageKey);
    });
});

function openFileSelector(postBox, storageKey) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/png, image/jpeg, image/jpg";

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            alert("Image exceeds the 1MB limit. Please choose a smaller file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Text = e.target.result;
            try {
                localStorage.setItem(storageKey, base64Text);
                displayImageInBox(postBox, base64Text, storageKey);
            } catch (err) {
                alert("Could not save image to localStorage (quota may be full).");
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    });

    fileInput.click();
}

function displayImageInBox(postBox, base64Text, storageKey) {
    postBox.innerHTML = "";

    const img = document.createElement("img");
    img.src = base64Text;
    img.alt = "User Post";

    const changeOverlay = document.createElement("div");
    changeOverlay.className = "image-overlay";
    changeOverlay.textContent = "Change Image";

    changeOverlay.addEventListener("click", () => {
        openFileSelector(postBox, storageKey);
    });

    postBox.appendChild(img);
    postBox.appendChild(changeOverlay);
}