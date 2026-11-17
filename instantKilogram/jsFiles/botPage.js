import { BOT_PROFILES } from "/jsFiles/botProfiles.js";
import { BOT_REPLY_LIBRARY } from "/jsFiles/botReplies.js";
import { userInfo } from "/jsFiles/userInfo.js";


// Get the bot configs from html and stop if it doesnt correspond to a curerent bot

const botId = document.body.dataset.botId;
const bot = BOT_PROFILES[botId];

if (!bot) {
    throw new Error(`No bot profile was found for ID: ${botId}`);
}

// Find the bots by their id function
function findBotById(id) {
    if (!id) {
        return null;
    }

    return BOT_PROFILES[id] || null;
}


// Find bit by name (ignoring capitalization and shtuff)
function findBotByUsername(username) {
    const normalizedUsername = String(username || "")
        .trim()
        .toLowerCase();

    if (!normalizedUsername) {
        return null;
    }

    return Object.values(BOT_PROFILES).find(profile =>
        String(profile.name || "").trim().toLowerCase() === normalizedUsername
    ) || null;
}


// define how the page checks for what bot wrote what comment
// Username is checked first so old data deosnt fck it up
function findCommentAuthorBot(comment) {
    if (!comment || comment.authorType !== "bot") {
        return null;
    }

    return findBotByUsername(comment.username)
        || findBotById(comment.botId)
        || null;
}


//Dm button

const sendDmButton = document.querySelector("#sendDmButton");

if (sendDmButton) {
    sendDmButton.href =
        `/htmlFiles/directMessages.html?bot=${encodeURIComponent(bot.id)}`;
}


//Make seperate keys for each bots so they dont have the same follows comment history an allat

const storagePrefix = `bot_${bot.id}`;

const followStorageKey = `${storagePrefix}_followed`;
const likesStorageKey = `${storagePrefix}_likes`;
const commentsStorageKey = `${storagePrefix}_comments`;


// Read anddsave JSON data in localStorage and corresponding error handling

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


// Load spessific bots info and check that the data has the correc array structure

let isFollowing = localStorage.getItem(followStorageKey) === "true";

let likedPosts = readJSON(likesStorageKey, []);

if (!Array.isArray(likedPosts)) {
    likedPosts = [];
}


// Load the saved comments for this bot.
let comments = readJSON(commentsStorageKey, null);

//Create the original demo comments when no history exists in local and keep the identities
if (!Array.isArray(comments) || comments.length === 0) {
    const currentTime = Date.now();

    comments = bot.initialComments.map((comment, index) => {
        const commentAuthor = findCommentAuthorBot(comment);

        return {
            ...comment,

            ...(commentAuthor ? {
                botId: commentAuthor.id,
                profilePicture: commentAuthor.profilePicture
            } : {}),

            id: `${bot.id}-starter-${index + 1}`,
            createdAt: new Date(
                currentTime - (bot.initialComments.length - index) * 60 * 60 * 1000
            ).toISOString()
        };
    });

    saveJSON(commentsStorageKey, comments);
}


//Repair old bots comments that has been assigned wrognly

let commentsWereRepaired = false;

comments = comments.map(comment => {
    if (comment.authorType !== "bot") {
        return comment;
    }

    const commentAuthor = findCommentAuthorBot(comment);

    if (!commentAuthor) {
        // Keep the existing picture if the author is not registered in BOT_PROFILES.
        return comment;
    }

    if (
        comment.botId !== commentAuthor.id ||
        comment.profilePicture !== commentAuthor.profilePicture
    ) {
        commentsWereRepaired = true;
    }

    return {
        ...comment,
        botId: commentAuthor.id,
        profilePicture: commentAuthor.profilePicture
    };
});

if (commentsWereRepaired) {
    saveJSON(commentsStorageKey, comments);
}


//Collection of refferences to html for profile info/stats ect where it'll be displaued

const profilePicturePlacement = document.querySelector("#profilePicturePlacement");
const userNamePlacement = document.querySelector(".userName");
const userBioPlacement = document.querySelector(".userBio");

const userPostsPlacement = document.querySelector(".userPosts p");
const userFollowersPlacement = document.querySelector(".userFollowers p");
const userFollowingPlacement = document.querySelector(".userFollowing p");

const followButton = document.querySelector("#followButton");
const postSection = document.querySelector("#classPostSection");


// Function for bot porfile config data building

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


// Functionality for updating the follow button and displaying its correct state

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


// Reusable helper for html element creation with optional assignments

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


// Function for dynamic botpost generation

function createBotPost(post) {
    const postCard = makeElement("article", "postBox botPost");
    postCard.dataset.postId = post.id;

    // The post image is a button so it can be opened in the full size viewer
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


// Function for liking and unliking and updating the count/saving status

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


//gets html ekements used by the comments dialogs

const commentDialog = document.querySelector("#commentDialog");
const closeCommentDialog = document.querySelector("#closeCommentDialog");
const commentPostCaption = document.querySelector("#commentPostCaption");
const commentList = document.querySelector("#commentList");
const commentForm = document.querySelector("#commentForm");
const commentInput = document.querySelector("#commentInput");
const commentStatus = document.querySelector("#commentStatus");

let activePostId = null;


//Function for formating creating and displaying comments in the dialog

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

    //Make the actual commenter connect to the avatar rather than using the bot thats opened
    const commentAuthor = findCommentAuthorBot(comment);

    avatar.src = commentAuthor?.profilePicture
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

    //parent id identify reply belonging
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


//Whole gdamn post section, event delegation for catching without attaching (ref:r9b61zt48)

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


// Automatic bot respons and user comment

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
    //Current profile response + 2 more random and randomlu wether they do or not
    const otherBots = Object.values(BOT_PROFILES)
        .filter(candidate => candidate.id !== bot.id);

    const requestedOtherBotCount = randomInteger(0, 2);
    const selectedOtherBots = shuffleArray(otherBots)
        .slice(0, requestedOtherBotCount);

    return [bot, ...selectedOtherBots];
}


function getRandomReply(replyingBotId) {
    const replyPool = BOT_REPLY_LIBRARY[replyingBotId]
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

        // Small delay in messages by requrest from Nilas and Henrik :p
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

        //Refresh comment display when a response happens if the comment window is open (save happens anyways)
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

    //User comment saved, then reply, then save and then connect to comment id
    sendAutomaticBotReplies(newComment);
});


closeCommentDialog.addEventListener("click", () => {
    commentDialog.close();
});


// Added this so you can click outside the dialog for it to dissapear
commentDialog.addEventListener("click", event => {
    if (event.target === commentDialog) {
        commentDialog.close();
    }
});


//Full image displayer

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


//The same shait, make this universal maby later (ref:p8d17jy53)
imageDialog.addEventListener("click", event => {
    if (event.target === imageDialog) {
        imageDialog.close();
    }
});


//Page setup

displayBotProfile();
displayBotPosts();
