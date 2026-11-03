// Genererer brukeren sin titlecard i mainpage

import { userInfo } from "./userInfo.js";

const mainDiv = document.querySelector("#mainDiv");

const profilePic = document.createElement("img");
profilePic.src = userInfo.profilePicture;
profilePic.alt = userInfo.name;

const name = document.createElement("h2");
name.textContent = userInfo.name;

const bio = document.createElement("p");
bio.textContent = userInfo.bio;

mainDiv.append(profilePic);
mainDiv.append(name);
mainDiv.append(bio);

mainDiv.classList.add("titleCard");

