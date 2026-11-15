import { BOT_PROFILES } from "/jsFiles/botProfiles.js";
import { BOT_REPLY_LIBRARY } from "/jsFiles/botReplies.js";
import { userInfo } from "/jsFiles/userInfo.js";


/* =========================================
   GET THE BOT CONFIGURATION
========================================= */

const botId = document.body.dataset.botId;
const bot = BOT_PROFILES[botId];

if (!bot) {
    throw new Error(`No bot profile was found for ID: ${botId}`);
}
// Open the shared DM inbox with the correct bot selected.
const sendDmButton = document.querySelector("#sendDmButton");

if (sendDmButton) {
    sendDmButton.href =
        `/htmlFiles/directMessages.html?bot=${encodeURIComponent(bot.id)}`;
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
        // Older starter comments did not have a botId. Add it when the
        // author is a bot so the correct profile picture is always used.
        ...(comment.authorType === "bot" ? {
            botId: comment.botId || bot.id,
            profilePicture: bot.profilePicture
        } : {}),
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
    const visual = makeElement("button", `botPostVisual postImageButton ${post.visualTheme || ""}`);
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

    // Use the profile picture belonging to the bot that wrote this comment.
    // This also supports comments from the other bots added in the future.
    const commentBot = comment.botId
        ? BOT_PROFILES[comment.botId]
        : (comment.authorType === "bot" ? bot : null);

    avatar.src = commentBot?.profilePicture
        || comment.profilePicture
        || "/assets/profile_icon.png";
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

    // Replies are saved with the ID of the comment they respond to.
    // Show that connection in the comment log.
    if (comment.replyTo) {
        const parentComment = comments.find(item => item.id === comment.replyTo);
        const parentName = parentComment?.username || "a comment";
        meta.append(
            makeElement("span", "commentReplyContext", `↳ replying to @${parentName}`)
        );
    }

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

function makeCommentId(prefix) {
    return `${bot.id}-${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}


function randomInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}


function shuffleArray(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
}


function chooseReplyingBots() {
    // The bot whose page is open always replies. Randomly select 0-2
    // additional bots from the rest of BOT_PROFILES.
    const otherBots = Object.values(BOT_PROFILES)
        .filter(candidate => candidate.id !== bot.id);

    const requestedOtherBotCount = randomInteger(0, 2);
    const selectedOtherBots = shuffleArray(otherBots)
        .slice(0, requestedOtherBotCount);

    return [bot, ...selectedOtherBots];
}


function getRandomReply(botId) {
    const replyPool = BOT_REPLY_LIBRARY[botId]
        || BOT_REPLY_LIBRARY.default
        || [];

    if (replyPool.length === 0) {
        return "I have thoughts about this, but I'm still organising them.";
    }

    return replyPool[Math.floor(Math.random() * replyPool.length)];
}


function wait(milliseconds) {
    return new Promise(resolve => window.setTimeout(resolve, milliseconds));
}


async function sendAutomaticBotReplies(userComment) {
    const replyingBots = chooseReplyingBots();

    for (let index = 0; index < replyingBots.length; index++) {
        const replyingBot = replyingBots[index];

        // Small staggered delays make each response feel like a new comment.
        if (commentDialog.open && activePostId === userComment.postId) {
            commentStatus.textContent = `${replyingBot.name} is typing...`;
        }

        await wait(randomInteger(900, 1900));

        const botReply = {
            id: makeCommentId(`${replyingBot.id}-reply`),
            postId: userComment.postId,
            username: replyingBot.name,
            profilePicture: replyingBot.profilePicture,
            message: getRandomReply(replyingBot.id),
            authorType: "bot",
            botId: replyingBot.id,
            replyTo: userComment.id,
            createdAt: new Date().toISOString()
        };

        comments.push(botReply);
        saveJSON(commentsStorageKey, comments);
        updateCommentButton(userComment.postId);

        // If the user has this post's comment window open, show the reply
        // as soon as it arrives. Replies are still saved if the dialog closes.
        if (commentDialog.open && activePostId === userComment.postId) {
            displayComments(userComment.postId);
        }
    }

    if (commentDialog.open && activePostId === userComment.postId) {
        const extraBotCount = replyingBots.length - 1;
        commentStatus.textContent = extraBotCount === 0
            ? `${bot.name} replied.`
            : `${bot.name} and ${extraBotCount} other bot${extraBotCount === 1 ? "" : "s"} replied.`;
    }
}


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
        id: makeCommentId("user"),
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
        ? `${bot.name} is thinking...`
        : "Comment displayed, but the browser could not save it.";

    // The user's comment is saved first. Bot replies are then added one by
    // one to the same post's comment log, each linked to this comment ID.
    sendAutomaticBotReplies(newComment);
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
