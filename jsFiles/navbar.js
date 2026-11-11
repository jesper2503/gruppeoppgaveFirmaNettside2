const navbar = document.createElement("nav");

function makeNavBar() {

    //1st nav link
    const navLink1 = document.createElement("a");
    navLink1.href = "../index.html";
    const navImage1 = document.createElement("img");
    navImage1.src = "../assets/home_icon.png";
    navLink1.append(navImage1);
    navbar.append(navLink1);

    //2nd nav link
    const navLink2 = document.createElement("a");
    navLink2.href = "";
    const navImage2 = document.createElement("img");
    navImage2.src = "../assets/post_icon.png";
    navLink2.append(navImage2);
    navbar.append(navLink2);

    //3rd nav link
    const navLink3 = document.createElement("a");
    navLink3.href = "../htmlFiles/userPage.html";
    const navImage3 = document.createElement("img");
    navImage3.src="../assets/profile_icon.png"
    navLink3.append(navImage3);
    navbar.append(navLink3);

    //append navbar
    document.body.appendChild(navbar);
};

makeNavBar();
