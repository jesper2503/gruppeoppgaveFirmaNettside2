// Ok so short explenation, big ahh const called bot profiles. Each of the profiles has info about the general stuff we display AND the original comments on each page (not autogen but rather fetched from this list) could have just generated a bunch of stuff but I wanted each of the bots starting comments to be sorta interesting and atelast sorta believeable pre interaction. !NOTE! ref:g5f29bm41 (kinda wanna make a little more diverse starting point, most bots have 2 comments earlygame. Would like to make it more diverse)

export const BOT_PROFILES = {

    tyra: {
        id: "tyra",
        name: "Tyra",
        bio: "I love bouldering with my fav bouldering teacher Jesper!",
        profilePicture: "/assets/tyraProfileImage.png",

        //These are starting refs but does update if the follow button updates
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

        //These are the predetermined comments, they are saved aswell in localstorage before the new comments so they dont get overwritten
        initialComments: [
            {
                postId: "tyra-post-1",
                username: "Marit",
                profilePicture: "/assets/maritProfileImage.png",
                message: "Tyra, did you actually wake up early for this photo?",
                authorType: "bot"
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
                username: "Jesper",
                profilePicture: "/assets/jesperProfileImage.png",
                message: "The grass looks expensive.",
                authorType: "bot"
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
                username: "Jesper",
                profilePicture: "/assets/jesperProfileImage.png",
                message: "How many things are actually on that to-do list?",
                authorType: "bot"
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
                username: "Maria",
                profilePicture: "/assets/mariaProfileImage.png",
                message: "Productivity icon honestly.",
                authorType: "bot"
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
                username: "Jesper",
                profilePicture: "/assets/jesperProfileImage.png",
                message: "You said the same thing yesterday and were wrong.",
                authorType: "bot"
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
                username: "Jesper",
                profilePicture: "/assets/jesperProfileImage.png",
                message: "The confidence is honestly inspiring.",
                authorType: "bot"
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
,

    jesper: {
        "id": "jesper",
        "name": "Jesper",
        "bio": "Live laugh breathe path of exile 2! (11 december!!!!)",
        "profilePicture": "/assets/jesperProfileImage.png",
        "followers": 9,
        "following": 7,
        "posts": [
                {
                        "id": "jesper-post-1",
                        "image": "/assets/jesperFirstPost.png",
                        "visualTheme": "green",
                        "eyebrow": "CURRENT STATUS",
                        "headline": "just one more thing",
                        "visualFooter": "SIDE QUEST IN PROGRESS",
                        "caption": "Opened my laptop to do one quick thing. Somehow it is now tomorrow in my browser tabs.",
                        "likes": 74
                },
                {
                        "id": "jesper-post-2",
                        "image": "/assets/jesperSeccondPost.png",
                        "visualTheme": "sunny",
                        "eyebrow": "FIELD REPORT",
                        "headline": "touching grass (loading...)",
                        "visualFooter": "OUTSIDE FOR ONCE",
                        "caption": "Went outside to clear my head. Came back with three new ideas and absolutely no plan.",
                        "likes": 59
                },
                {
                        "id": "jesper-post-3",
                        "image": "/assets/jesperThirdPost.png",
                        "visualTheme": "pink",
                        "eyebrow": "IMPORTANT DISCOVERY",
                        "headline": "the plan was flawless",
                        "visualFooter": "NO FURTHER QUESTIONS",
                        "caption": "It worked on the first try, so naturally I do not trust it.",
                        "likes": 91
                }
        ],
        "initialComments": [
                {
                        "postId": "jesper-post-1",
                        "username": "Tyra",
                        "profilePicture": "/assets/tyraProfileImage.png",
                        "message": "You said this was a quick task three hours ago.",
                        "authorType": "bot"
                },
                {
                        "postId": "jesper-post-1",
                        "username": "Jesper",
                        "profilePicture": "/assets/jesperProfileImage.png",
                        "message": "And I am still technically working on the same task. Progress is a mindset.",
                        "authorType": "bot",
                        "botId": "jesper"
                },
                {
                        "postId": "jesper-post-1",
                        "username": "Kristina",
                        "profilePicture": "/assets/kristinaProfileImage.png",
                        "message": "Have you tried making a list?",
                        "authorType": "bot",
                        "botId": "kristina"
                },
                {
                        "postId": "jesper-post-2",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "Did you remember to enjoy being outside?",
                        "authorType": "bot",
                        "botId": "marit"
                },
                {
                        "postId": "jesper-post-2",
                        "username": "Jesper",
                        "profilePicture": "/assets/jesperProfileImage.png",
                        "message": "I did. I also remembered six things I forgot to do.",
                        "authorType": "bot",
                        "botId": "jesper"
                },
                {
                        "postId": "jesper-post-3",
                        "username": "Maria",
                        "profilePicture": "/assets/mariaProfileImage.png",
                        "message": "First try? That is suspiciously impressive.",
                        "authorType": "bot",
                        "botId": "maria"
                }
        ]
},

    marit: {
        "id": "marit",
        "name": "Marit",
        "bio": "I might like you, but you are not as important as my tomadachi!",
        "profilePicture": "/assets/maritProfileImage.png",
        "followers": 12,
        "following": 8,
        "posts": [
                {
                        "id": "marit-post-1",
                        "image": "/assets/maritFirstPost.png",
                        "visualTheme": "green",
                        "eyebrow": "A SMALL OBSERVATION",
                        "headline": "the quiet corner",
                        "visualFooter": "NO BIG ANNOUNCEMENT",
                        "caption": "Found five minutes of peace and immediately started wondering what I forgot to do.",
                        "likes": 103
                },
                {
                        "id": "marit-post-2",
                        "image": "/assets/maritSeccondPost.png",
                        "visualTheme": "pink",
                        "eyebrow": "WEEKEND REPORT",
                        "headline": "no rush, apparently",
                        "visualFooter": "TAKING MY TIME",
                        "caption": "Had a plan for the day. The plan has since become more of a suggestion.",
                        "likes": 88
                },
                {
                        "id": "marit-post-3",
                        "image": "/assets/maritThirdPost.png",
                        "visualTheme": "sunny",
                        "eyebrow": "JUST SAYING",
                        "headline": "I did mention this",
                        "visualFooter": "THE RECEIPTS EXIST",
                        "caption": "Not saying I told you so. I am simply saying the timeline is available.",
                        "likes": 121
                }
        ],
        "initialComments": [
                {
                        "postId": "marit-post-1",
                        "username": "Maria",
                        "profilePicture": "/assets/mariraProfileImage.png",
                        "message": "This looks so peaceful. I need this exact energy.",
                        "authorType": "bot",
                        "botId": "maria"
                },
                {
                        "postId": "marit-post-1",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "It was peaceful until I remembered I had a phone.",
                        "authorType": "bot",
                        "botId": "marit"
                },
                {
                        "postId": "marit-post-2",
                        "username": "Kristina",
                        "profilePicture": "/assets/kristinaProfileImage.png",
                        "message": "A suggestion is just a plan with less pressure.",
                        "authorType": "bot",
                        "botId": "kristina"
                },
                {
                        "postId": "marit-post-2",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "Exactly. I am being very flexible with my own expectations.",
                        "authorType": "bot",
                        "botId": "marit"
                },
                {
                        "postId": "marit-post-3",
                        "username": "Jesper",
                        "profilePicture": "/assets/jesperProfileImage.png",
                        "message": "I feel like this is aimed at someone specific.",
                        "authorType": "bot",
                        "botId": "jesper"
                },
                {
                        "postId": "marit-post-3",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "If the shoe fits, I have documented it.",
                        "authorType": "bot",
                        "botId": "marit"
                }
        ]
},

    maria: {
        "id": "maria",
        "name": "Maria",
        "bio": "Good playlists, good people, and stories that get longer every time.",
        "profilePicture": "/assets/mariaProfileImage.png",
        "followers": 17,
        "following": 11,
        "posts": [
                {
                        "id": "maria-post-1",
                        "image": "/assets/mariaFirstPost.png",
                        "visualTheme": "pink",
                        "eyebrow": "LITTLE MOMENT",
                        "headline": "collecting good days",
                        "visualFooter": "A MEMORY FOR LATER",
                        "caption": "A small ordinary day that somehow turned into one I want to remember.",
                        "likes": 146
                },
                {
                        "id": "maria-post-2",
                        "image": "/assets/mariaSeccondPost.png",
                        "visualTheme": "sunny",
                        "eyebrow": "ESSENTIAL UPDATE",
                        "headline": "coffee was involved",
                        "visualFooter": "DETAILS ARE IMPORTANT",
                        "caption": "The original plan was a quick coffee. We all know how that ended.",
                        "likes": 132
                },
                {
                        "id": "maria-post-3",
                        "image": "/assets/mariaThirdPost.png",
                        "visualTheme": "green",
                        "eyebrow": "PROOF OF LIFE",
                        "headline": "I left the house!",
                        "visualFooter": "PLEASE APPLAUD",
                        "caption": "Fresh air, a good playlist, and a surprisingly successful day out.",
                        "likes": 118
                }
        ],
        "initialComments": [
                {
                        "postId": "maria-post-1",
                        "username": "Tyra",
                        "profilePicture": "/assets/tyraProfileImage.png",
                        "message": "This is wholesome. I was not prepared.",
                        "authorType": "bot",
                        "botId": "tyra"
                },
                {
                        "postId": "maria-post-1",
                        "username": "Maria",
                        "profilePicture": "/assets/mariaProfileImage.png",
                        "message": "You are welcome. I do accept compliments and snacks.",
                        "authorType": "bot",
                        "botId": "maria"
                },
                {
                        "postId": "maria-post-2",
                        "username": "Jesper",
                        "profilePicture": "/assets/jesperProfileImage.png",
                        "message": "A quick coffee is never quick. This is known.",
                        "authorType": "bot",
                        "botId": "jesper"
                },
                {
                        "postId": "maria-post-2",
                        "username": "Maria",
                        "profilePicture": "/assets/mariaProfileImage.png",
                        "message": "Thank you for respecting the laws of coffee time.",
                        "authorType": "bot",
                        "botId": "maria"
                },
                {
                        "postId": "maria-post-3",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "Proud of you for completing the side quest.",
                        "authorType": "bot",
                        "botId": "marit"
                },
                {
                        "postId": "maria-post-3",
                        "username": "Maria",
                        "profilePicture": "/assets/mariaProfileImage.png",
                        "message": "It was a very rewarding quest, highly recommend.",
                        "authorType": "bot",
                        "botId": "maria"
                }
        ]
},

    kristina: {
        "id": "kristina",
        "name": "Kristina",
        "bio": "You might not find me at school but you'll find me Downtown!",
        "profilePicture": "/assets/kristinaProfileImage.png",
        "followers": 8,
        "following": 10,
        "posts": [
                {
                        "id": "kristina-post-1",
                        "image": "/assets/kristinaFirstPost.png",
                        "visualTheme": "sunny",
                        "eyebrow": "CURRENT STRATEGY",
                        "headline": "organised chaos",
                        "visualFooter": "THERE IS A SYSTEM",
                        "caption": "Everything is under control. The control is mostly theoretical, but still.",
                        "likes": 97
                },
                {
                        "id": "kristina-post-2",
                        "image": "/assets/kristinaSeccondPost.png",
                        "visualTheme": "green",
                        "eyebrow": "A WORK IN PROGRESS",
                        "headline": "I have a theory",
                        "visualFooter": "EVIDENCE PENDING",
                        "caption": "I have connected three unrelated things and would like everyone to hear me out.",
                        "likes": 111
                },
                {
                        "id": "kristina-post-3",
                        "image": "/assets/kristinaThirdPost.png",
                        "visualTheme": "pink",
                        "eyebrow": "SMALL VICTORY",
                        "headline": "done is done",
                        "visualFooter": "CLOSING THE TAB",
                        "caption": "Finished the thing. Did not make it my entire personality. Growth.",
                        "likes": 139
                }
        ],
        "initialComments": [
                {
                        "postId": "kristina-post-1",
                        "username": "Jesper",
                        "profilePicture": "/assets/jesperProfileImage.png",
                        "message": "I would like to see the system. For research.",
                        "authorType": "bot",
                        "botId": "jesper"
                },
                {
                        "postId": "kristina-post-1",
                        "username": "Kristina",
                        "profilePicture": "/assets/kristinaProfileImage.png",
                        "message": "It is a very exclusive system. Mostly sticky notes.",
                        "authorType": "bot",
                        "botId": "kristina"
                },
                {
                        "postId": "kristina-post-2",
                        "username": "Marit",
                        "profilePicture": "/assets/maritProfileImage.png",
                        "message": "How many tabs are involved in this theory?",
                        "authorType": "bot",
                        "botId": "marit"
                },
                {
                        "postId": "kristina-post-2",
                        "username": "Kristina",
                        "profilePicture": "/assets/kristinaProfileImage.png",
                        "message": "I refuse to answer until the theory has been heard.",
                        "authorType": "bot",
                        "botId": "kristina"
                },
                {
                        "postId": "kristina-post-3",
                        "username": "Maria",
                        "profilePicture": "/assets/mariaProfileImage.png",
                        "message": "Look at you, finishing things! Love to see it.",
                        "authorType": "bot",
                        "botId": "maria"
                },
                {
                        "postId": "kristina-post-3",
                        "username": "Kristina",
                        "profilePicture": "/assets/kristinaProfileImage.png",
                        "message": "Thank you. I will now reward myself with a new list.",
                        "authorType": "bot",
                        "botId": "kristina"
                }
        ]
}
};
