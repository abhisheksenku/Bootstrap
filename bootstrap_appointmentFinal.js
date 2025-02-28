document.addEventListener('DOMContentLoaded', function () {
    const appointmentForm = document.getElementById('appointment_form');
    const fullAccess = document.getElementById('full_access');
    loadStorage();

    appointmentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const detailsObj = {
            name: username,
            mail: email,
            number: phone
        };
        saveStorage(detailsObj);
        addDatatoList(detailsObj);
        appointmentForm.reset();
    });

    fullAccess.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete_button')) {
            const listItem = event.target.closest('.individual_access');
            if (listItem) {
                const detailsToDelete = listItem.dataset.details;
                listItem.remove();
                deleteStorage(detailsToDelete);
            }
        }
        if (event.target.classList.contains('edit_button')) {
            const listItem = event.target.closest('.individual_access');
            if (listItem) {
                const [name, mail, number] = listItem.dataset.details.split('|');
                listItem.innerHTML = `
                    <input type="text" value="${name}" class="form-control edit_name">
                    <input type="text" value="${mail}" class="form-control edit_mail">
                    <input type="text" value="${number}" class="form-control edit_number">
                    <button class="btn btn-success btn-sm save_button">Save</button>
                `;
            }
        }
        if (event.target.classList.contains('save_button')) {
            const listItem = event.target.closest('.individual_access');
            if (listItem) {
                const updatedName = listItem.querySelector('.edit_name').value;
                const updatedMail = listItem.querySelector('.edit_mail').value;
                const updatedNumber = listItem.querySelector('.edit_number').value;
                updateStorage(listItem.dataset.details, {
                    name: updatedName,
                    mail: updatedMail,
                    number: updatedNumber
                });
                listItem.innerHTML = `Details: ${updatedName}, ${updatedMail}, ${updatedNumber}`;
                listItem.dataset.details = `${updatedName}|${updatedMail}|${updatedNumber}`;
                editDeleteButtons(listItem);
            }
        }
    });
});

function loadStorage() {
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
        // for (let i=0;i<existingUsers.length;i++){
    //     addToLIst(existingUsers[i]);
    // }
    existingUsers.forEach(element => {
        addDatatoList(element);
    });
}

function updateStorage(objToEdit, newObj) {
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
    for (let i = 0; i < existingUsers.length; i++) {
        if (`${existingUsers[i].name}|${existingUsers[i].mail}|${existingUsers[i].number}` === objToEdit) {
            existingUsers[i] = newObj;
        }
    }
    localStorage.setItem('existingKeyUsers', JSON.stringify(existingUsers));
}

function deleteStorage(objToDelete) {
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
    let newUsers = existingUsers.filter(user => `${user.name}|${user.mail}|${user.number}` !== objToDelete);
    localStorage.setItem('existingKeyUsers', JSON.stringify(newUsers));
}

function saveStorage(objToSave) {
    let existingUsers = JSON.parse(localStorage.getItem('existingKeyUsers')) || [];
    existingUsers.push(objToSave);
    localStorage.setItem('existingKeyUsers', JSON.stringify(existingUsers));
}

function addDatatoList(user) {
    const listItem = document.createElement('li');
    listItem.className = 'individual_access d-flex justify-content-between align-items-center';
    listItem.dataset.details = `${user.name}|${user.mail}|${user.number}`;
    listItem.textContent = `Details: ${user.name}, ${user.mail}, ${user.number}`;

    editDeleteButtons(listItem);
    document.getElementById('full_access').appendChild(listItem);
}

function editDeleteButtons(listItem) {
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
    listItem.appendChild(groupButton);
}