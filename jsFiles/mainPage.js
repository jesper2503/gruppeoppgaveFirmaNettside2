import { titleCards } from "titleCards.js";

const mainDiv = document.querySelector("#mainDiv");

for (let i of titleCards) {
    let div = document.createElement("div");
    div.textContent = i;
    div.classList.add("titleCard");

    mainDiv.append(div);
}