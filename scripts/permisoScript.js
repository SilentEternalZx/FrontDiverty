const btnOpenPrivilege=
document.querySelector("#btn-open-privilege")
const btnClosePrivilege=
document.querySelector("#btn-close-privilege")
const modal=
document.querySelector("#modal")


btnOpenPrivilege.addEventListener("click",()=>{
    modal.showModal()
})
btnClosePrivilege.addEventListener("click",()=>{
    modal.close()
})

