import { userInfo } from "./userInfo.js";

function displayUserInfo() {
    //Profile picture
    const profilePicturePlacement = document.querySelector("#profilePicturePlacement");
    const profilePicImg = document.createElement("img");
    profilePicImg.src = userInfo.profilePicture;
    profilePicturePlacement.append(profilePicImg);

    //Username
    const userNamePlacement = document.querySelector(".userName");
    const userNameInfo = document.createElement("h2");
    const userName = userInfo.name;
    userNameInfo.append(userName);
    userNamePlacement.append(userNameInfo);

    //userStats
    const userPostsPlacement = document.querySelector(".userPosts");
    const userPostInfo = document.createElement("p");
    const userPosts = userInfo.userPosts;
    userPostInfo.append(userPosts);
    userPostsPlacement.append(userPostInfo);

    const userFollowersPlacement = document.querySelector(".userFollowers");
    const userFollowersInfo = document.createElement("p");
    const userFollowers = userInfo.userFollowers;
    userFollowersInfo.append(userFollowers);
    userFollowersPlacement.append(userFollowersInfo);

    const userFollowingPlacement = document.querySelector(".userFollowing");
    const userFollowingInfo = document.createElement("p");
    const userFollowing = userInfo.userFollowing;
    userFollowingInfo.append(userFollowing);
    userFollowingPlacement.append(userFollowingInfo);

    //Bio
    const userBioPlacement = document.querySelector(".userBio");
    const userBioInfo = document.createElement("p");
    const userBio = userInfo.bio;
    userBioInfo.append(userBio);
    userBioPlacement.append(userBio);
};

displayUserInfo();

//Modal button
const settingsDialog = document.querySelector("#settingsDialog");
const showModalButton = document.querySelector("#showModalButton");
const hideModalButton = document.querySelector("#hideModalButton");

showModalButton.addEventListener("click", () => {
    settingsDialog.showModal();
});

hideModalButton.addEventListener("click", () => {
    settingsDialog.close();
});

//SettingsFunctionality
//All the elements
const modalUsernameInput = document.querySelector("#modalUsernameInput");
const modalBioInput = document.querySelector("#modalBioInput");
const modalFileInput = document.querySelector("#modalFileInput");
const savedImagePreview = document.querySelector("#savedImagePreview");
const statusMessage = document.querySelector("#statusMessage");

//Local storage value loading
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem("savedUsername")) {
        modalUsernameInput.value = localStorage.getItem("savedUsername");
    }
    if (localStorage.getItem("savedUserBio")) {
        modalBioInput.value = localStorage.getItem("savedBio")
    }
    //Image restoration via Base64 string
    const savedImage = localStorage.getItem("savedProfilePic");
    if (savedImage) {
        savedImagePreview.src = savedImage;
        savedImagePreview.style.display = "block";
        statusMessage.textContent = "Loaded profile picture from memory"
    }
});