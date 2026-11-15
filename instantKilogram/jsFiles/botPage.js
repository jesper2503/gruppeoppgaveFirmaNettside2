import { BOT_PROFILES } from "/jsFiles/botProfiles.js";
import { userInfo } from "/jsFiles/userInfo.js";


/* =========================================
   GET THE BOT CONFIGURATION
========================================= */

const botId = document.body.dataset.botId;
const bot = BOT_PROFILES[botId];

if (!bot) {
    throw new Error(`No bot profile was found for ID: ${botId}`);
}


/* =========================================
   LOCALSTORAGE KEYS
   Each bot gets its own separate saved data.
========================================= */

const storagePrefix = `bot_${bot.id}`;

const followStorageKey = `${storagePrefix}_followed`;
const likesStorageKey = `${storagePrefix}_likes`;
const commentsStorageKey = `${storagePrefix}_comments`;


/* =========================================
   STORAGE HELPERS
========================================= */

function readJSON(key, fallbackValue) {
    try {
        const savedValue = localStorage.getItem(key);

        if (savedValue === null) {
            return fallbackValue;
        }

        return JSON.parse(savedValue);

    } catch (error) {
        console.error(`Could not read ${key} from localStorage:`, error);
        return fallbackValue;
    }
}


function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;

    } catch (error) {
        console.error(`Could not save ${key} to localStorage:`, error);
        return false;
    }
}


/* =========================================
   LOAD SAVED INTERACTION DATA
========================================= */

let isFollowing = localStorage.getItem(followStorageKey) === "true";

let likedPosts = readJSON(likesStorageKey, []);

if (!Array.isArray(likedPosts)) {
    likedPosts = [];
}


// Add the starter comments only when this bot has no saved comment history.
let comments = readJSON(commentsStorageKey, null);

// An older test version may have saved an empty array. Treat that as an
// uninitialized comment history so the starter conversations appear.
if (!Array.isArray(comments) || comments.length === 0) {
    const currentTime = Date.now();

    comments = bot.initialComments.map((comment, index) => ({
        ...comment,
        id: `${bot.id}-starter-${index + 1}`,
        createdAt: new Date(
            currentTime - (bot.initialComments.length - index) * 60 * 60 * 1000
        ).toISOString()
    }));

    saveJSON(commentsStorageKey, comments);
}


/* =========================================
   PROFILE ELEMENTS
========================================= */

const profilePicturePlacement = document.querySelector("#profilePicturePlacement");
const userNamePlacement = document.querySelector(".userName");
const userBioPlacement = document.querySelector(".userBio");

const userPostsPlacement = document.querySelector(".userPosts p");
const userFollowersPlacement = document.querySelector(".userFollowers p");
const userFollowingPlacement = document.querySelector(".userFollowing p");

const followButton = document.querySelector("#followButton");
const postSection = document.querySelector("#classPostSection");


/* =========================================
   DISPLAY BOT PROFILE
========================================= */

function displayBotProfile() {
    const profilePicture = document.createElement("img");
    profilePicture.src = bot.profilePicture;
    profilePicture.alt = `${bot.name}'s profile picture`;

    profilePicturePlacement.replaceChildren(profilePicture);

    const nameHeading = document.createElement("h2");
    nameHeading.textContent = bot.name;
    userNamePlacement.replaceChildren(nameHeading);

    const biography = document.createElement("p");
    biography.textContent = bot.bio;
    userBioPlacement.replaceChildren(biography);

    userPostsPlacement.textContent = `Posts: ${bot.posts.length}`;
    userFollowersPlacement.textContent = `Followers: ${bot.followers + (isFollowing ? 1 : 0)}`;
    userFollowingPlacement.textContent = `Following: ${bot.following}`;

    updateFollowButton();
}


/* =========================================
   FOLLOW / UNFOLLOW
========================================= */

function updateFollowButton() {
    followButton.textContent = isFollowing ? "Following" : "Follow";
    followButton.setAttribute("aria-pressed", String(isFollowing));
    followButton.classList.toggle("isFollowing", isFollowing);

    userFollowersPlacement.textContent =
        `Followers: ${bot.followers + (isFollowing ? 1 : 0)}`;
}


followButton.addEventListener("click", () => {
    isFollowing = !isFollowing;

    try {
        localStorage.setItem(followStorageKey, String(isFollowing));
    } catch (error) {
        console.error("Could not save follow status:", error);
    }

    updateFollowButton();
});


/* =========================================
   POST ELEMENT HELPERS
========================================= */

function makeElement(tagName, className, text = "") {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text !== "") {
        element.textContent = text;
    }

    return element;
}


function getCommentsForPost(postId) {
    return comments.filter(comment => comment.postId === postId);
}


/* =========================================
   CREATE BOT POSTS
========================================= */

function createBotPost(post) {
    const postCard = makeElement("article", "postBox botPost");
    postCard.dataset.postId = post.id;

    // The post image is a button so it can be opened in the full-size viewer.
    const visual = makeElement("button", "botPostVisual postImageButton");
    visual.type = "button";
    visual.dataset.action = "view-image";
    visual.dataset.postId = post.id;
    visual.setAttribute("aria-label", `View ${bot.name}'s full post image`);

    const postImage = makeElement("img", "botPostImage");
    postImage.src = post.image;
    postImage.alt = `${bot.name}'s post: ${post.headline}`;

    const imageOverlay = makeElement("span", "postImageOverlay");
    imageOverlay.append(
        makeElement("span", "postEyebrow", post.eyebrow),
        makeElement("span", "postVisualHeadline", post.headline),
        makeElement("span", "postVisualFooter", post.visualFooter)
    );

    visual.append(postImage, imageOverlay);

    // Caption and interaction buttons.
    const content = makeElement("div", "botPostContent");
    const caption = makeElement("p", "postCaption", post.caption);

    const interactionRow = makeElement("div", "postInteractionRow");

    const likeButton = makeElement("button", "postActionButton");
    likeButton.type = "button";
    likeButton.dataset.action = "like";
    likeButton.dataset.postId = post.id;
    likeButton.setAttribute("aria-pressed", String(likedPosts.includes(post.id)));

    const likeIcon = makeElement("span", "actionIcon", "♡");
    likeIcon.setAttribute("aria-hidden", "true");

    const likeLabel = makeElement("span", "likeLabel", "Like");

    const likeCount = makeElement("span", "postLikeCount");
    likeCount.dataset.likeCount = post.id;

    const isLiked = likedPosts.includes(post.id);
    likeButton.classList.toggle("isLiked", isLiked);
    likeIcon.textContent = isLiked ? "♥" : "♡";
    likeCount.textContent = `${post.likes + (isLiked ? 1 : 0)} likes`;

    likeButton.append(likeIcon, likeLabel);

    const commentButton = makeElement("button", "postActionButton");
    commentButton.type = "button";
    commentButton.dataset.action = "comment";
    commentButton.dataset.postId = post.id;
    commentButton.textContent = `Comment · ${getCommentsForPost(post.id).length}`;

    interactionRow.append(likeButton, commentButton, likeCount);
    content.append(caption, interactionRow);
    postCard.append(visual, content);

    return postCard;
}


function displayBotPosts() {
    const postCards = bot.posts.map(post => createBotPost(post));
    postSection.replaceChildren(...postCards);
}


/* =========================================
   LIKE / UNLIKE POSTS
========================================= */

function updateLikeButton(button, post) {
    const isLiked = likedPosts.includes(post.id);

    button.classList.toggle("isLiked", isLiked);
    button.setAttribute("aria-pressed", String(isLiked));

    const icon = button.querySelector(".actionIcon");
    icon.textContent = isLiked ? "♥" : "♡";

    const likeCount = postSection.querySelector(`[data-like-count="${post.id}"]`);

    if (likeCount) {
        likeCount.textContent = `${post.likes + (isLiked ? 1 : 0)} likes`;
    }
}


function togglePostLike(postId, button) {
    const post = bot.posts.find(item => item.id === postId);

    if (!post) {
        return;
    }

    if (likedPosts.includes(postId)) {
        likedPosts = likedPosts.filter(id => id !== postId);
    } else {
        likedPosts.push(postId);
    }

    const saved = saveJSON(likesStorageKey, likedPosts);
    updateLikeButton(button, post);

    if (!saved) {
        console.warn("Your like changed on this page but could not be saved.");
    }
}


/* =========================================
   COMMENTS DIALOG ELEMENTS
========================================= */

const commentDialog = document.querySelector("#commentDialog");
const closeCommentDialog = document.querySelector("#closeCommentDialog");
const commentPostCaption = document.querySelector("#commentPostCaption");
const commentList = document.querySelector("#commentList");
const commentForm = document.querySelector("#commentForm");
const commentInput = document.querySelector("#commentInput");
const commentStatus = document.querySelector("#commentStatus");

let activePostId = null;


/* =========================================
   DISPLAY COMMENTS
========================================= */

function formatCommentTime(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Just now";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
}


function createCommentElement(comment) {
    const commentItem = makeElement(
        "article",
        `commentItem ${comment.authorType === "bot" ? "isBotComment" : ""}`
    );

    const avatar = makeElement("img", "commentAvatar");

    // Always use the current bot profile picture for bot comments.
    if (comment.authorType === "bot") {
        avatar.src = bot.profilePicture;
    } else {
        // Use the saved profile picture for everyone else.
        avatar.src = comment.profilePicture || "/assets/profile_icon.png";
    }

    avatar.alt = `${comment.username}'s profile picture`;

    const bubble = makeElement("div", "commentBubble");
    const meta = makeElement("div", "commentMeta");

    const username = makeElement("span", "commentUsername", comment.username);
    meta.append(username);

    if (comment.authorType === "bot") {
        meta.append(makeElement("span", "botCommentTag", "Bot"));
    }

    meta.append(
        makeElement("span", "commentTimestamp", formatCommentTime(comment.createdAt))
    );

    const message = makeElement("p", "commentMessage", comment.message);

    bubble.append(meta, message);
    commentItem.append(avatar, bubble);

    return commentItem;
}


function displayComments(postId) {
    const postComments = getCommentsForPost(postId)
        .slice()
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const commentElements = postComments.map(comment => createCommentElement(comment));
    commentList.replaceChildren(...commentElements);

    if (postComments.length === 0) {
        commentList.append(
            makeElement("p", "emptyCommentsMessage", "No comments yet. Be the first!")
        );
    }

    commentList.scrollTop = commentList.scrollHeight;
}


function updateCommentButton(postId) {
    const button = postSection.querySelector(
        `[data-action="comment"][data-post-id="${postId}"]`
    );

    if (button) {
        button.textContent = `Comment · ${getCommentsForPost(postId).length}`;
    }
}


function openComments(postId) {
    const post = bot.posts.find(item => item.id === postId);

    if (!post) {
        return;
    }

    activePostId = postId;
    commentPostCaption.textContent = `${bot.name}: ${post.caption}`;
    commentStatus.textContent = "";
    commentInput.value = "";

    displayComments(postId);
    commentDialog.showModal();
    commentInput.focus();
}


/* =========================================
   COMMENT BUTTON EVENT DELEGATION
========================================= */

postSection.addEventListener("click", event => {
    const actionButton = event.target.closest("button[data-action]");

    if (!actionButton) {
        return;
    }

    const postId = actionButton.dataset.postId;

    if (actionButton.dataset.action === "like") {
        togglePostLike(postId, actionButton);
    }

    if (actionButton.dataset.action === "comment") {
        openComments(postId);
    }

    if (actionButton.dataset.action === "view-image") {
        openFullSizeImage(postId);
    }
});


/* =========================================
   ADD A USER COMMENT
========================================= */

commentForm.addEventListener("submit", event => {
    event.preventDefault();

    const messageText = commentInput.value.trim();

    if (!messageText || !activePostId) {
        return;
    }

    const currentUsername =
        localStorage.getItem("savedUsername") || userInfo.name || "No name";

    const currentProfilePicture =
        localStorage.getItem("savedProfilePic") || userInfo.profilePicture;

    const newComment = {
        id: `${bot.id}-user-${Date.now()}`,
        postId: activePostId,
        username: currentUsername,
        profilePicture: currentProfilePicture,
        message: messageText,
        authorType: "user",
        createdAt: new Date().toISOString()
    };

    comments.push(newComment);

    const saved = saveJSON(commentsStorageKey, comments);

    displayComments(activePostId);
    updateCommentButton(activePostId);

    commentInput.value = "";
    commentStatus.textContent = saved
        ? "Comment posted."
        : "Comment displayed, but the browser could not save it.";
});


closeCommentDialog.addEventListener("click", () => {
    commentDialog.close();
});


// Clicking the shaded area outside the dialog closes it.
commentDialog.addEventListener("click", event => {
    if (event.target === commentDialog) {
        commentDialog.close();
    }
});


/* =========================================
   FULL-SIZE POST IMAGE VIEWER
========================================= */

const imageDialog = document.querySelector("#imageDialog");
const expandedPostImage = document.querySelector("#expandedPostImage");
const closeImageDialog = document.querySelector("#closeImageDialog");

function openFullSizeImage(postId) {
    const post = bot.posts.find(item => item.id === postId);

    if (!post || !post.image) {
        return;
    }

    expandedPostImage.src = post.image;
    expandedPostImage.alt = `${bot.name}'s post: ${post.headline}`;
    imageDialog.showModal();
}

closeImageDialog.addEventListener("click", () => {
    imageDialog.close();
});

// Clicking the dark area outside the image closes the viewer.
imageDialog.addEventListener("click", event => {
    if (event.target === imageDialog) {
        imageDialog.close();
    }
});


/* =========================================
   INITIAL PAGE SETUP
========================================= */

displayBotProfile();
displayBotPosts();
