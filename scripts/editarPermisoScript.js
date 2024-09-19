const btnOpenEdit=
document.querySelector("#btn-open-edit")
const btnCloseEdit=
document.querySelector("#btn-close-edit")
const editModal=
document.querySelector("#editModal")


btnOpenEdit.addEventListener("click",()=>{
    editModal.showModal()
})
btnCloseEdit.addEventListener("click",()=>{
    editModal.close()
})
