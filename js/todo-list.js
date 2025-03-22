// JavaScript functionality will go here

document.addEventListener('DOMContentLoaded', () => {
  let todoList = [];

  function addTodo(){
    let inputElement = document.querySelector('.js-name-input');
    let nameVal = inputElement.value;

    let dateInputElement = document.querySelector('.js-due-date-input');
    
    //Remove these lines bc it overwrites the date input
    /*let today = new Date().toISOString().split('T')[0];
    dateInputElement.value = today;
    */

    if (!dateInputElement.value) {
      dateInputElement.value = new Date().toISOString().split('T')[0];
    }
    let dueDateVal = new Date(dateInputElement.value + 'T00:00').toLocaleDateString('en-US');
    
    
    todoList.push({
      name: nameVal, 
      dueDate: dueDateVal
    });
    console.log(todoList);

    inputElement.value = '';
    renderTodoList();

  }

  function renderTodoList(){
    let todoListHTML = '';

    for(let i = 0; i < todoList.length; i++){
      //const name = todoList[i].name;
      //const dueDate = todoList[i].dueDate;
      const {name, dueDate} = todoList[i];

      let html = `
      <div>${i+1}. ${name}</div>
      <div>${dueDate}</div>
      <button class="delete-todo-button js-delete-todo-button">Delete</button>
      `;
      todoListHTML += html;
    }
    document.querySelector('.js-todo-list').innerHTML = todoListHTML;

    document.querySelectorAll('.js-delete-todo-button').forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {
        todoList.splice(index, 1);
        renderTodoList();
      });
    });
  }

  /*
  function handleEnterKey(event){
    if(event.key === 'Enter'){
      addTodo();
    }
  }
  */

  document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    console.log('Button clicked');
    addTodo();
  });

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement !== document.querySelector('.js-due-date-input')) {
      addTodo();
    }
  });


});