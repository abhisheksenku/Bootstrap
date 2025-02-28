document.addEventListener('DOMContentLoaded',function(){
    const appointmentForm  = document.getElementById('appointment_form');
    const fullAccess = document.getElementById('full_access');
    loadStorage();
    appointmentForm.addEventListener('submit',function(event){
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const detailsObj ={
            name: username,
            mail:email,
            number:phone
        }
        saveStorage(detailsObj);
        addDatatoList(detailsObj);
        appointmentForm.reset();
    })
})
fullAccess.addEventListener('click',function(event){
    if(event.target.classList.contains('delete_button')){
        const listItem = event.target.closest('.individual_access');
        if(listItem){
            const detailsTodelete = listItem.dataset.details;
            listItem.remove();
            deleteStorage(detailsTodelete);
        }
    }
    if(event.target.classList.contains('edit_button')){
        const listItem = event.target.closest('.individual_access');
        if(listItem){
            const[name,mail,number]=listItem.dataset.details.split('|');
            listItem.innerHTML = `
            <input type="text" value="${name}" class="form-control edit_name">
            <input type="text" value="${mail}" class="form-control edit_mail">
            <input type="text" value="${number}" class="form-control edit_number">
            <button class="btn btn-success btn-sm save_button">Save</button>
        `;
            
        }
    }
    if(event.target.classList.contains('save_button')){
        const listItem = event.target.closest('.individual_access');
        if(listItem){
            const updatedname = listItem.querySelector('.edit_name').value;
            const updatedmail = listItem.querySelector('.edit_mail').value;
            const updatednumber = listItem.querySelector('.edit_number').value;
            updateStorage(listItem.dataset.details,{
                name : updatedname,
                mail : updatedname,
                number : updatednumber
            });
            listItem.innerHTML =`Details: ${updatedname},${updatedmail},${updatednumber}`;
            listItem.dataset.details = `${updatedname}|${updatedmail}|${updatednumber}`;
            editDeleteButtons(listItem);
        }
    }
})
function loadStorage(){
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers'))||[];
    // for (let i=0;i<existingUsers.length;i++){
    //     addToLIst(existingUsers[i]);
    // }
    existingUsers.forEach(element => {
        addToList(element)
    });
}
function updateStorage(objWewantToedit,newobjWegot){
    let existingUsers = JSON.parse(loadStorage.getItem('existingKeyUsers')) || [];
    for(let i=0; i<existingUsers.length;i++){
        if(`${existingUsers[i].name}|${existingUsers[i].mail}|${existingUsers[i].number}` === objWewantToedit){
            existingUsers[i] = newobjWegot
        }
    }
    localStorage.setItem('existingKeyUsers',JSON.stringify(existingUsers));
}
function deleteStorage(objTodelete){
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
    let newUsers = []
    for(let i=0; i<existingUsers.length;i++){
        if(`${existingUsers[i].name}|${existingUsers[i].mail}|${existingUsers[i].number}`!== objTodelete){
           newUsers.push(existingUsers[i]); 
        }
    }
    existingUsers = newUsers;
    localStorage.setItem('existingKeyUsers',JSON.stringify(existingUsers));
}
function saveStorage(objTosave){
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
    existingUsers.push(objTosave);
    loadStorage.setItem('existingKeyUsers',JSON.stringify(existingUsers));
}
function addDatatoList(existingUsers){
    const list_item = document.createElement('li');
    list_item.className = 'individual_access d-flex justify-content-bteween align-items-center';
    list_item.dataset.details = `${existingUsers.name}|${existingUsers.mail}|${existingUsers.number}`;
    list_item.textContent=`Details:${existingUsers.name},${existingUsers.mail},${existingUsers.number}`;

    editDeleteButtons(list_item);
    fullAccess.appendChild(list_item);
}

function editDeleteButtons(list_item){
    const groupButton = document.createElement('div');
    groupButton.className = 'btn_group';
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-warning btn-sm edit_button';
    editButton.textContent = 'Edit';
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger btn-sm delete_button';
    deleteButton.textContent = 'Delete';

    groupButton.appendChild(deleteButton);
    groupButton.appendChild(editButton);
    list_item.appendChild(groupButton);

}
