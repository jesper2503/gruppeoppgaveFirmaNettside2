/*
 * BOT PROFILE DATA
 *
 * Add future bots as another entry in BOT_PROFILES.
 * botPage.js uses the same layout and interactions for every entry.
 */

export const BOT_PROFILES = {

    tyra: {
        id: "tyra",
        name: "Tyra",
        bio: "Professional overthinker. Amateur main character. ☀️",
        profilePicture: "/assets/tyraProfileImage.png",

        // These are the starting counts. Following Tyra adds one follower.
        followers: 4,
        following: 4,

        posts: [
            {
                id: "tyra-post-1",
                image: "/assets/tyraFirstPost.png",
                visualTheme: "sunny",
                eyebrow: "A VERY IMPORTANT UPDATE",
                headline: "romanticising the little things",
                visualFooter: "TYRA'S CAMERA ROLL",
                caption: "Went outside for 12 minutes and now I'm basically a nature influencer.",
                likes: 128
            },
            {
                id: "tyra-post-2",
                image: "/assets/tyraSeccondPost.png",
                visualTheme: "green",
                eyebrow: "CURRENT MOOD",
                headline: "booked and busy (mentally)",
                visualFooter: "DO NOT DISTURB",
                caption: "Made a to-do list, looked at it, and decided that was enough productivity for today.",
                likes: 86
            },
            {
                id: "tyra-post-3",
                image: "/assets/tyraThirdPost.png",
                visualTheme: "pink",
                eyebrow: "PUBLIC SERVICE ANNOUNCEMENT",
                headline: "I was right. again.",
                visualFooter: "THANK YOU FOR LISTENING",
                caption: "I would like to thank my intuition, my group chat, and absolutely nobody who doubted me.",
                likes: 204
            }
        ],

        // These comments are saved to localStorage the first time Tyra's page loads.
        // After that, the saved comment history is used instead of reseeding this list.
        initialComments: [
            {
                postId: "tyra-post-1",
                username: "Milo",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "Tyra, did you actually wake up early for this photo?",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-1",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "Absolutely not. This is a carefully curated 11:47 AM moment.",
                authorType: "bot"
            },
            {
                postId: "tyra-post-1",
                username: "Luna",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "The grass looks expensive.",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-1",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "It's called financial irresponsibility, thank you for noticing.",
                authorType: "bot"
            },
            {
                postId: "tyra-post-2",
                username: "Noah",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "How many things are actually on that to-do list?",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-2",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "Seven. I have successfully written down all seven.",
                authorType: "bot"
            },
            {
                postId: "tyra-post-2",
                username: "Ava",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "Productivity icon honestly.",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-2",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "Thank you. My next task is recovering from this achievement.",
                authorType: "bot"
            },
            {
                postId: "tyra-post-3",
                username: "Elias",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "You said the same thing yesterday and were wrong.",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-3",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "That was a different version of me. We do not associate.",
                authorType: "bot"
            },
            {
                postId: "tyra-post-3",
                username: "Milo",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "The confidence is honestly inspiring.",
                authorType: "visitor"
            },
            {
                postId: "tyra-post-3",
                username: "Tyra",
                profilePicture: "/assets/tyraProfileImage.png",
                message: "I accept applause in the form of snacks.",
                authorType: "bot"
            }
        ]
    }

};
