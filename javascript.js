
const navMenu = document.querySelector(".nav-bar .invite-button img");

console.log( navMenu );
const navOptions = document.querySelector(".nav-options");


navMenu.addEventListener( "click" , () =>{
    navOptions.classList.toggle("clicker");
})

setInterval( function() {
    const body = document.querySelector("body");
    if( body.clientWidth > 360 && navOptions.classList.contains("clicker") )
        navOptions.classList.remove("clicker");

} , 100 );