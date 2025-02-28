document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.querySelector('#expense_form');
    const expenseList = document.getElementById('expense_list');

    // Load expenses from local storage when the page loads
    loadExpenses();

    expenseForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const expense_to_Add = document.getElementById('expense').value;
        const description_to_Add = document.getElementById('description').value;
        const category_to_Add = document.getElementById('category').value;

        // Create an expense object
        const expenseObj = {
            expense: expense_to_Add,
            description: description_to_Add,
            category: category_to_Add
        };

        // Save to local storage
        saveExpenseToLocal(expenseObj);

        // Display the expense on the UI
        addExpenseToUI(expenseObj);

        // Clear the form after submission
        expenseForm.reset();
    });

    expenseList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete_button')) {
            const listItem = event.target.closest('.list-group-item');
            if (listItem) {
                const expenseText = listItem.dataset.expense;
                listItem.remove();
                deleteExpenseFromLocal(expenseText);
            }
        }

        if (event.target.classList.contains('edit_button')) {
            const listItem = event.target.closest('.list-group-item');
            if (listItem) {
                // Extract current values
                const [expense, description, category] = listItem.dataset.expense.split('|');

                // Replace text content with input fields
                listItem.innerHTML = `
                    <input type="text" value="${expense}" class="form-control edit_expense">
                    <input type="text" value="${description}" class="form-control edit_description">
                    <select class="form-select edit_category">
                        <option value="movie" ${category === 'movie' ? 'selected' : ''}>Movie</option>
                        <option value="food" ${category === 'food' ? 'selected' : ''}>Food</option>
                        <option value="clothing" ${category === 'clothing' ? 'selected' : ''}>Clothing</option>
                        <option value="games" ${category === 'games' ? 'selected' : ''}>Games</option>
                    </select>
                    <button class="btn btn-success btn-sm save_button">Save</button>
                `;
            }
        }

        if (event.target.classList.contains('save_button')) {
            const listItem = event.target.closest('.list-group-item');
            if (listItem) {
                // Get updated values
                const updatedExpense = listItem.querySelector('.edit_expense').value;
                const updatedDescription = listItem.querySelector('.edit_description').value;
                const updatedCategory = listItem.querySelector('.edit_category').value;

                // Update local storage
                updateExpenseInLocal(listItem.dataset.expense, {
                    expense: updatedExpense,
                    description: updatedDescription,
                    category: updatedCategory
                });

                // Update UI
                listItem.innerHTML = `Expense: ${updatedExpense}, Description: ${updatedDescription}, Category: ${updatedCategory}`;
                listItem.dataset.expense = `${updatedExpense}|${updatedDescription}|${updatedCategory}`;

                // Re-add buttons
                addEditDeleteButtons(listItem);
            }
        }
    });

    // Function to add an expense to the UI
    function addExpenseToUI(expenseObj) {
        const newList_to_Item = document.createElement('li');
        newList_to_Item.className = 'list-group-item d-flex justify-content-between align-items-center';
        newList_to_Item.dataset.expense = `${expenseObj.expense}|${expenseObj.description}|${expenseObj.category}`;
        newList_to_Item.textContent = `Expense: ${expenseObj.expense}, Description: ${expenseObj.description}, Category: ${expenseObj.category}`;

        addEditDeleteButtons(newList_to_Item);

        expenseList.appendChild(newList_to_Item);
    }

    // Function to add edit and delete buttons
    function addEditDeleteButtons(listItem) {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'btn-group';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-warning btn-sm edit_button';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger btn-sm delete_button';

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        listItem.appendChild(buttonGroup);
    }

    // Function to save an expense to local storage
    function saveExpenseToLocal(expenseObj) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(expenseObj);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Function to delete an expense from local storage
    function deleteExpenseFromLocal(expenseText) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(exp => `${exp.expense}|${exp.description}|${exp.category}` !== expenseText);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Function to update an expense in local storage
    function updateExpenseInLocal(oldExpenseText, newExpenseObj) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.map(exp => 
            `${exp.expense}|${exp.description}|${exp.category}` === oldExpenseText ? newExpenseObj : exp
        );
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Function to load expenses from local storage
    function loadExpenses() {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.forEach(expenseObj => addExpenseToUI(expenseObj));
    }
});