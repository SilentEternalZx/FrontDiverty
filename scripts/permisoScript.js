const btnOpenPrivilege=
document.querySelector("#btn-open-privilege")
const btnClosePrivilege=
document.querySelector("#btn-close-privilege")
const modalPrivilegio=
document.querySelector("#modalPrivilegio")


btnOpenPrivilege.addEventListener("click",()=>{
    modalPrivilegio.showModal()
})
btnClosePrivilege.addEventListener("click",()=>{
    modalPrivilegio.close()
})

