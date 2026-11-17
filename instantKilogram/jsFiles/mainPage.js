// Generate the users title/profile ect fro localStorage if possible and if there's no localSotrafe info then default to the predetermined object in userInfo (lowkey kinda notices way too late that userInfo.js is absolutely useless and I could have just setlocalStorage and kept it all there. Turned in to a dance from userInfo and lS that I dont have time to fix)

import { userInfo } from "/jsFiles/userInfo.js";

const mainDiv = document.querySelector("#mainDiv");
const mainDivHead = document.querySelector("#mainDivHead");

const profilePic = document.createElement("img");
profilePic.alt = "Profile picture";
if (localStorage.getItem("savedProfilePic") == null) {
    profilePic.src = userInfo.profilePicture;
} else {
    profilePic.src = localStorage.getItem("savedProfilePic");
};

const name = document.createElement("h3");
if (localStorage.getItem("savedUsername") == null) {
    name.textContent = userInfo.name;
} else {
    name.textContent = localStorage.getItem("savedUsername");
};

const bio = document.createElement("p");
if (localStorage.getItem("savedBio") == null) {
    bio.textContent = userInfo.bio;
} else {
    bio.textContent = localStorage.getItem("savedBio");
}

mainDivHead.append(profilePic);
mainDiv.append(name);
mainDiv.append(bio);

mainDiv.classList.add("titleCard");

