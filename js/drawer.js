// ==============================
// DRAWER SYSTEM
// Glow At Home
// ==============================



const overlay = document.querySelector(".drawer-overlay");


// Search elements

const searchBtn = document.querySelector(".search-btn");
const searchDrawer = document.querySelector(".search-drawer");
const closeSearch = document.querySelector(".close-search");


// Menu elements

const menuBtn = document.querySelector(".menu-btn");
const menuDrawer = document.querySelector(".menu-drawer");
const closeMenu = document.querySelector(".close-menu");




// ==============================
// OPEN SEARCH
// ==============================


searchBtn.addEventListener("click", () => {


    searchDrawer.classList.add("active");

    overlay.classList.add("active");


});




// ==============================
// CLOSE SEARCH
// ==============================


closeSearch.addEventListener("click", () => {


    searchDrawer.classList.remove("active");

    overlay.classList.remove("active");


});





// ==============================
// OPEN MENU
// ==============================


menuBtn.addEventListener("click", () => {


    menuDrawer.classList.add("active");

    overlay.classList.add("active");


});






// ==============================
// CLOSE MENU
// ==============================


closeMenu.addEventListener("click", () => {


    menuDrawer.classList.remove("active");

    overlay.classList.remove("active");


});






// ==============================
// CLOSE WHEN CLICKING OUTSIDE
// ==============================


overlay.addEventListener("click", () => {


    searchDrawer.classList.remove("active");

    menuDrawer.classList.remove("active");


    overlay.classList.remove("active");


});






// ==============================
// ESCAPE KEY CLOSE
// ==============================


document.addEventListener("keydown",(event)=>{


    if(event.key === "Escape"){


        searchDrawer.classList.remove("active");

        menuDrawer.classList.remove("active");


        overlay.classList.remove("active");


    }


});