// Genererer brukeren sin titlecard i mainpage

import { userInfo } from "./userInfo.js";

const mainDiv = document.querySelector("#mainDiv");
const mainDivHead = document.querySelector("#mainDivHead");

const profilePic = document.createElement("img");
profilePic.src = userInfo.profilePicture;
profilePic.alt = userInfo.name;

const name = document.createElement("h3");
name.textContent = userInfo.name;

const bio = document.createElement("p");
bio.textContent = userInfo.bio;

mainDivHead.append(profilePic);
mainDiv.append(name);
mainDiv.append(bio);

mainDiv.classList.add("titleCard");

