let hamburguer = document.querySelector(".hamburguer")
let menu = document.querySelector(".barra-lateral-header")

hamburguer.addEventListener("click", () =>{
    menu.style.display = 'flex'
})

let fechar = document.querySelector(".fechar-menu")
    fechar.addEventListener("click", () =>{
    menu.style.display = 'none'
})

window.addEventListener("resize", ()=>{ 
    if (window.innerWidth > 685) {
        menu.style.display = "none";
    }
});
/*
let slick = document.querySelector(".single-item")
window.addEventListener("resize", ()=>{
    if(window.innerWidth == 706){
        slick.style.display = 'block'
    }
})*/