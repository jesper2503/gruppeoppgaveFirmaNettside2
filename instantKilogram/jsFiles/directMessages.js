import { BOT_PROFILES } from "/jsFiles/botProfiles.js";
import { BOT_DM_GREETINGS, BOT_DM_REPLY_LIBRARY } from "/jsFiles/botDmReplies.js";
import { userInfo } from "/jsFiles/userInfo.js";


/* =========================================
   INBOX CONFIGURATION
========================================= */

const bots = Object.values(BOT_PROFILES);
const botById = Object.fromEntries(bots.map(bot => [bot.id, bot]));
const profilePageForBot = botId => `/htmlFiles/${botId}Bot.html`;
const DEFAULT_BOT_ID = botById.tyra ? "tyra" : bots[0]?.id;

if (bots.length === 0) {
    throw new Error("No bots were found in BOT_PROFILES.");
}


/* =========================================
   PAGE ELEMENTS
========================================= */

const workspace = document.querySelector("#dmWorkspace");
const chatList = document.querySelector("#dmChatList");
const chatCount = document.querySelector("#dmChatCount");
const searchInput = document.querySelector("#dmSearchInput");

const activeAvatar = document.querySelector("#dmActiveAvatar");
const activeName = document.querySelector("#dmActiveName");
const activeStatus = document.querySelector("#dmActiveStatus");
const profileLink = document.querySelector("#dmProfileLink");

const messageList = document.querySelector("#dmMessageList");
const typingIndicator = document.querySelector("#dmTypingIndicator");
const typingText = document.querySelector("#dmTypingText");

const composer = document.querySelector("#dmComposer");
const messageInput = document.querySelector("#dmMessageInput");
const sendButton = document.querySelector("#dmSendButton");
const composerHint = document.querySelector("#dmComposerHint");
const backButton = document.querySelector("#dmBackButton");


/* =========================================
   CURRENT USER INFORMATION
========================================= */

function getCurrentUser() {
    const savedName = localStorage.getItem("savedUsername");
    const savedPicture = localStorage.getItem("savedProfilePic");

    return {
        name: (savedName || userInfo.name || "You").trim() || "You",
        profilePicture: savedPicture || userInfo.profilePicture || "/assets/profile_icon.png"
    };
}


/* =========================================
   STORAGE HELPERS
   Each bot has its own DM history and pending replies.
========================================= */

function messagesStorageKey(botId) {
    return `bot_${botId}_dm_messages`;
}

function pendingStorageKey(botId) {
    return `bot_${botId}_dm_pending_replies`;
}

function readJSON(key, fallbackValue) {
    try {
        const rawValue = localStorage.getItem(key);

        if (rawValue === null) {
            return fallbackValue;
        }

        const parsedValue = JSON.parse(rawValue);
        return parsedValue;

    } catch (error) {
        console.error(`Could not read ${key} from localStorage:`, error);
        return fallbackValue;
    }
}

function writeJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;

    } catch (error) {
        console.error(`Could not save ${key} to localStorage:`, error);
        return false;
    }
}

function createId(prefix) {
    if (globalThis.crypto?.randomUUID) {
        return `${prefix}-${globalThis.crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}


/* =========================================
   CONVERSATION DATA
========================================= */

function createMessage(bot, senderType, messageText) {
    const currentUser = getCurrentUser();
    const isBotMessage = senderType === "bot";

    return {
        id: createId(senderType),
        botId: bot.id,
        senderType,
        senderName: isBotMessage ? bot.name : currentUser.name,
        senderPicture: isBotMessage ? bot.profilePicture : currentUser.profilePicture,
        message: messageText,
        createdAt: new Date().toISOString()
    };
}

function getConversation(bot) {
    const key = messagesStorageKey(bot.id);
    const savedMessages = readJSON(key, null);

    if (Array.isArray(savedMessages) && savedMessages.length > 0) {
        return savedMessages.filter(message =>
            message &&
            typeof message.message === "string" &&
            typeof message.senderType === "string"
        );
    }

    // Every new chat starts with a bot greeting. This is saved just like
    // normal messages, so it will not be recreated after a refresh.
    const greeting = BOT_DM_GREETINGS[bot.id]
        || `Hi! Thanks for messaging me. What's up?`;

    const firstMessage = createMessage(bot, "bot", greeting);
    writeJSON(key, [firstMessage]);

    return [firstMessage];
}

function saveConversation(botId, messages) {
    return writeJSON(messagesStorageKey(botId), messages);
}

function addMessage(bot, message) {
    const messages = getConversation(bot);
    messages.push(message);
    saveConversation(bot.id, messages);
    return messages;
}


/* =========================================
   DATE AND DISPLAY HELPERS
========================================= */

const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit"
});

const dayFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
});

function getMessageDateLabel(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (first, second) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    if (sameDay(date, today)) return "Today";
    if (sameDay(date, yesterday)) return "Yesterday";
    return dayFormatter.format(date);
}

function getValidDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
}

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

function setImageSource(image, source, altText) {
    image.src = source || "/assets/profile_icon.png";
    image.alt = altText;

    image.addEventListener("error", () => {
        image.src = "/assets/profile_icon.png";
    }, { once: true });
}


/* =========================================
   RENDER ONE MESSAGE
========================================= */

function createMessageElement(bot, message) {
    const isBotMessage = message.senderType === "bot";
    const row = makeElement(
        "article",
        `dmMessageRow ${isBotMessage ? "fromBot" : "fromUser"}`
    );

    if (isBotMessage) {
        const avatar = makeElement("img", "dmMessageAvatar");
        setImageSource(avatar, message.senderPicture || bot.profilePicture, `${bot.name}'s profile picture`);
        row.append(avatar);
    }

    const content = makeElement("div", "dmMessageContent");
    const bubble = makeElement("div", "dmMessageBubble");
    const text = makeElement("p", "dmMessageText", message.message);
    bubble.append(text);

    const time = makeElement("time", "dmMessageTime");
    const createdAt = getValidDate(message.createdAt);
    time.dateTime = createdAt.toISOString();
    time.textContent = timeFormatter.format(createdAt);

    content.append(bubble, time);
    row.append(content);

    return row;
}


/* =========================================
   RENDER ACTIVE CONVERSATION
========================================= */

let activeBotId = null;
const pendingCounts = new Map();

function getPendingReplies(botId) {
    const pending = readJSON(pendingStorageKey(botId), []);
    return Array.isArray(pending) ? pending : [];
}

function updateTypingIndicator() {
    if (!activeBotId) {
        typingIndicator.hidden = true;
        return;
    }

    const pendingCount = pendingCounts.get(activeBotId) || 0;
    typingIndicator.hidden = pendingCount === 0;

    const bot = botById[activeBotId];
    typingText.textContent = pendingCount > 0
        ? `${bot.name} is typing...`
        : "";
}

function renderConversation(botId) {
    const bot = botById[botId];

    if (!bot) return;

    activeBotId = botId;

    setImageSource(activeAvatar, bot.profilePicture, `${bot.name}'s profile picture`);
    activeName.textContent = bot.name;
    activeStatus.textContent = "InstaKG bot · usually replies quickly";
    profileLink.href = profilePageForBot(bot.id);
    profileLink.setAttribute("aria-label", `View ${bot.name}'s profile`);

    const messages = getConversation(bot);
    const renderedMessages = [];
    let previousDateLabel = "";

    messages.forEach(message => {
        const date = getValidDate(message.createdAt);
        const dateLabel = getMessageDateLabel(date);

        if (dateLabel !== previousDateLabel) {
            renderedMessages.push(makeElement("div", "dmDateDivider", dateLabel));
            previousDateLabel = dateLabel;
        }

        renderedMessages.push(createMessageElement(bot, message));
    });

    messageList.replaceChildren(...renderedMessages);
    messageList.scrollTop = messageList.scrollHeight;

    chatList.querySelectorAll(".dmChatItem").forEach(button => {
        const isSelected = button.dataset.botId === botId;
        button.classList.toggle("isActive", isSelected);
        button.setAttribute("aria-current", isSelected ? "page" : "false");
    });

    updateTypingIndicator();
    workspace.classList.add("isChatOpen");
    messageInput.focus({ preventScroll: true });
}


/* =========================================
   CONVERSATION LIST / SIDEBAR
========================================= */

function getLastMessage(bot) {
    const messages = getConversation(bot);
    return messages[messages.length - 1];
}

function renderSidebar(searchTerm = "") {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const sortedBots = [...bots].sort((firstBot, secondBot) => {
        const firstDate = getValidDate(getLastMessage(firstBot)?.createdAt).getTime();
        const secondDate = getValidDate(getLastMessage(secondBot)?.createdAt).getTime();
        return secondDate - firstDate;
    });

    const visibleBots = sortedBots.filter(bot =>
        bot.name.toLowerCase().includes(normalizedSearch)
    );

    const chatButtons = visibleBots.map(bot => {
        const button = makeElement("button", "dmChatItem");
        button.type = "button";
        button.dataset.botId = bot.id;
        button.setAttribute("aria-label", `Open chat with ${bot.name}`);

        const avatarWrap = makeElement("span", "dmChatAvatarWrap");
        const avatar = makeElement("img", "dmChatAvatar");
        setImageSource(avatar, bot.profilePicture, `${bot.name}'s profile picture`);
        const onlineDot = makeElement("span", "dmOnlineDot");
        onlineDot.setAttribute("aria-label", "Available");
        avatarWrap.append(avatar, onlineDot);

        const textWrap = makeElement("span", "dmChatText");
        const topLine = makeElement("span", "dmChatTopLine");
        const name = makeElement("span", "dmChatName", bot.name);
        const time = makeElement("time", "dmChatTime");
        const lastMessage = getLastMessage(bot);
        const lastDate = getValidDate(lastMessage?.createdAt);
        time.dateTime = lastDate.toISOString();
        time.textContent = timeFormatter.format(lastDate);
        topLine.append(name, time);

        const preview = makeElement("span", "dmChatPreview");
        const pendingCount = pendingCounts.get(bot.id) || 0;
        preview.textContent = pendingCount > 0
            ? "Typing..."
            : `${lastMessage?.senderType === "user" ? "You: " : ""}${lastMessage?.message || "Start a conversation"}`;

        textWrap.append(topLine, preview);

        const chevron = makeElement("span", "dmChatChevron", "›");
        chevron.setAttribute("aria-hidden", "true");

        button.append(avatarWrap, textWrap, chevron);
        button.addEventListener("click", () => {
            setActiveBot(bot.id, true);
        });

        if (bot.id === activeBotId) {
            button.classList.add("isActive");
            button.setAttribute("aria-current", "page");
        }

        return button;
    });

    chatList.replaceChildren(...chatButtons);
    chatCount.textContent = String(bots.length);

    if (visibleBots.length === 0) {
        const emptySearch = makeElement("p", "dmNoSearchResults", "No conversations found.");
        chatList.append(emptySearch);
    }
}


/* =========================================
   BOT REPLY SELECTION
========================================= */

function chooseBotReply(botId, userMessage, conversation) {
    const replyLibrary = BOT_DM_REPLY_LIBRARY[botId] || BOT_DM_REPLY_LIBRARY.tyra;
    const cleanMessage = userMessage.trim().toLowerCase();

    let replyType = "general";

    if (/^(hi|hello|hey|hiya|heya|yo|good morning|good evening|good afternoon)\b/.test(cleanMessage)) {
        replyType = "greetings";
    } else if (/\b(thanks|thank you|thx|ty|cheers)\b/.test(cleanMessage)) {
        replyType = "thanks";
    } else if (cleanMessage.includes("?") || /^(what|why|how|when|where|who|can|could|would|do|does|is|are)\b/.test(cleanMessage)) {
        replyType = "questions";
    }

    const pool = replyLibrary[replyType] || replyLibrary.general || [];
    const recentBotMessages = conversation
        .filter(message => message.senderType === "bot")
        .slice(-5)
        .map(message => message.message);

    const freshReplies = pool.filter(reply => !recentBotMessages.includes(reply));
    const availableReplies = freshReplies.length > 0 ? freshReplies : pool;

    return availableReplies[Math.floor(Math.random() * availableReplies.length)]
        || "Tell me more!";
}


/* =========================================
   PERSISTENT DELAYED BOT REPLIES
   Pending replies are saved as well. If the user refreshes while a bot is
   typing, the reply is restored and delivered after the remaining delay.
========================================= */

function setPendingCount(botId, count) {
    if (count <= 0) {
        pendingCounts.delete(botId);
    } else {
        pendingCounts.set(botId, count);
    }

    if (activeBotId === botId) {
        updateTypingIndicator();
    }

    renderSidebar(searchInput.value);
}

function schedulePendingReply(bot, pendingReply, delayOverride = null) {
    const delay = delayOverride === null
        ? Math.max(0, pendingReply.respondAt - Date.now())
        : Math.max(0, delayOverride);

    setPendingCount(bot.id, (pendingCounts.get(bot.id) || 0) + 1);

    window.setTimeout(() => {
        const pendingReplies = getPendingReplies(bot.id);
        const stillPending = pendingReplies.some(item => item.id === pendingReply.id);

        if (stillPending) {
            const remainingReplies = pendingReplies.filter(item => item.id !== pendingReply.id);
            writeJSON(pendingStorageKey(bot.id), remainingReplies);

            const botMessage = createMessage(bot, "bot", pendingReply.message);
            const updatedConversation = addMessage(bot, botMessage);

            if (activeBotId === bot.id) {
                renderConversation(bot.id);
            }

            // The latest preview and typing status in the sidebar are refreshed too.
            renderSidebar(searchInput.value);
        }

        setPendingCount(bot.id, (pendingCounts.get(bot.id) || 1) - 1);
    }, delay);
}

function restorePendingReplies() {
    bots.forEach(bot => {
        const pendingReplies = getPendingReplies(bot.id);
        pendingReplies.forEach(pendingReply => {
            schedulePendingReply(bot, pendingReply);
        });
    });
}

function queueBotReply(bot, userMessage, conversation) {
    const pendingReply = {
        id: createId("pending"),
        message: chooseBotReply(bot.id, userMessage, conversation),
        respondAt: Date.now() + 1100 + Math.floor(Math.random() * 1500)
    };

    const pendingReplies = getPendingReplies(bot.id);
    pendingReplies.push(pendingReply);

    const saved = writeJSON(pendingStorageKey(bot.id), pendingReplies);

    if (saved) {
        schedulePendingReply(bot, pendingReply);
    } else {
        // Still respond during this visit if browser storage is unavailable.
        setPendingCount(bot.id, (pendingCounts.get(bot.id) || 0) + 1);
        window.setTimeout(() => {
            addMessage(bot, createMessage(bot, "bot", pendingReply.message));
            if (activeBotId === bot.id) renderConversation(bot.id);
            setPendingCount(bot.id, (pendingCounts.get(bot.id) || 1) - 1);
        }, Math.max(0, pendingReply.respondAt - Date.now()));
    }
}


/* =========================================
   SEND A MESSAGE
========================================= */

function sendCurrentMessage() {
    const messageText = messageInput.value.trim();

    if (!messageText || !activeBotId) {
        return;
    }

    const bot = botById[activeBotId];
    const userMessage = createMessage(bot, "user", messageText);
    const updatedConversation = addMessage(bot, userMessage);
    const wasSaved = saveConversation(bot.id, updatedConversation);

    messageInput.value = "";
    resizeMessageInput();

    renderConversation(bot.id);
    renderSidebar(searchInput.value);

    composerHint.textContent = wasSaved
        ? `Message sent to ${bot.name}.`
        : "Message displayed, but browser storage could not save it.";

    queueBotReply(bot, messageText, updatedConversation);
}

composer.addEventListener("submit", event => {
    event.preventDefault();
    sendCurrentMessage();
});

messageInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        composer.requestSubmit();
    }
});

function resizeMessageInput() {
    messageInput.style.height = "auto";
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 120)}px`;
}

messageInput.addEventListener("input", resizeMessageInput);


/* =========================================
   SWITCH ACTIVE CHAT / URL STATE
========================================= */

function setActiveBot(botId, updateUrl = false) {
    if (!botById[botId]) {
        botId = DEFAULT_BOT_ID;
    }

    renderSidebar(searchInput.value);
    renderConversation(botId);

    if (updateUrl) {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("bot", botId);
        window.history.replaceState({}, "", nextUrl);
    }
}

backButton.addEventListener("click", () => {
    workspace.classList.remove("isChatOpen");
    searchInput.focus({ preventScroll: true });
});

searchInput.addEventListener("input", () => {
    renderSidebar(searchInput.value);
});

window.addEventListener("popstate", () => {
    const requestedBotId = new URLSearchParams(window.location.search).get("bot");
    setActiveBot(requestedBotId || DEFAULT_BOT_ID, false);
});


/* =========================================
   INITIALIZE THE INBOX
========================================= */

// Ensure every bot has its own saved conversation and a welcome message.
bots.forEach(bot => getConversation(bot));

// Resume any delayed replies that were still pending when the page refreshed.
restorePendingReplies();

const requestedBotId = new URLSearchParams(window.location.search).get("bot");
const initialBotId = botById[requestedBotId] ? requestedBotId : DEFAULT_BOT_ID;

renderSidebar();
setActiveBot(initialBotId, false);
