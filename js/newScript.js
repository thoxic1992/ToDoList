

document.addEventListener('DOMContentLoaded', function(){

  
  // anchors
  const form = document.querySelector('form');
  const toDoForm = document.querySelector('.todo-form');
  const ul = document.querySelector('ul');
  const button = document.querySelector('#addButton');
  const textField = document.querySelector('.text-field');

  const check = 'fa-check-circle';
  const uncheck = 'fa-circle';
  const lineThrough = 'lineThrough';
  
  let list = [];

  const addToDo = function(toDo, id, extra){
    
    //const itemDone = (extra === true) ? check : uncheck;
    //const itemDoneBackground = (extra === true) ? 'checked' : 'unchecked';
    //const itemLineThrough = (extra === true) ? lineThrough : '';
    const item = `
                  <li class='todo-item unchecked'>
                    <i class="far fa-circle" data-job='complete' id="${id}"></i>
                    <p class="text" data-job='edit' id="${id}">${toDo}</p>
                    <i class="fas fa-trash delete-button" data-job='delete' id="${id}"></i>
                  </li>
                  `;
    const position = 'beforeend';
    ul.insertAdjacentHTML(position, item);
  };
  
  fetch('http://195.181.210.249:3000/todo/').then(response => response.json()
  ).then(json => {
    loadList(json);
  })
  .catch(() => {
  console.log("Blad!");
}); 

  // ładowanie listy z serwera
  function loadList(array){
    array.forEach(element => {
      addToDo(element.title, element.id/*, element.extra*/);
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

  toDoForm.addEventListener('submit', function(e) {
    e.preventDefault();
  }); 

  
  
  // dodawanie zadania
  button.addEventListener('click', function(){
    const toDo = textField.value;
    if(toDo) {
      addToDo(toDo);
      list.push({
        title : toDo
      });
      fetch("http://195.181.210.249:3000/todo/", {
	      method: 'POST',
	      headers: {
          'Content-Type': 'application/json',
  	      },
  	    body: JSON.stringify(list),
        })
        .then((response) => response.json())
        .then((list) => {
        console.log('Success:', list);
        })
        .catch((error) => {
	      console.error('Error:', error);
        });
    } else {
      const emptyField = textField.getAttribute('placeholder');
      addToDo(emptyField);
      list.push({
        title : emptyField,
      });
      fetch("http://195.181.210.249:3000/todo/", {
	      method: 'POST',
	      headers: {
          'Content-Type': 'application/json',
  	      },
  	    body: JSON.stringify(list),
        })
        .then((response) => response.json())
        .then((list) => {
        console.log('Success:', list);
        })
        .catch((error) => {
	      console.error('Error:', error);
        });
    }
    textField.value = '';
  });

  // wykonanie zadania
  function completeToDo(el){
    el.classList.toggle(check);
    el.classList.toggle(uncheck);
    el.nextElementSibling.classList.toggle(lineThrough);
    el.parentElement.classList.toggle('checked');
    el.parentElement.classList.toggle('unchecked');
  }

  // usuwanie zadania
  function deleteToDo(el){
    el.parentElement.parentElement.removeChild(el.parentElement);
    fetch(`http://195.181.210.249:3000/todo/${el.id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
    });
  }

  ul.addEventListener('click', function(event){
    const clickedElement = event.target; // return clicked element
    const clickedElementJob = clickedElement.dataset.job;

    if (clickedElementJob == 'complete'){
        completeToDo(clickedElement);
    } else if (clickedElementJob == 'delete'){
        deleteToDo(clickedElement);
    }
  });

  // edycja zadania
  ul.addEventListener('dblclick', (event) => {
    const clickedItem = event.target;
    const clickedElementJob = clickedItem.dataset.job;
    const value = clickedItem.textContent;
    const id = clickedItem.id;
    if (clickedElementJob == 'edit'){
     clickedItem.outerHTML =  `<input class="text " data-job="edit" id="${id}" value='${value}'></input>`;
    }
  });

  ul.addEventListener('keypress', function pressEnter(event){
    if (event.keyCode === 13){
      saveChanges(event);
    }
  }, false);

  ul.addEventListener('focusout', function looseFocus(event){
    saveChanges(event);
  });

  function saveChanges(event){
    const clickedItem = event.target;
    if (clickedItem.hasAttribute('value')){
        const newInput = document.querySelector('[value]');
        const id = clickedItem.id;
        const newInputValue = document.querySelector('[value]').getAttribute('value');
        if(!newInput.value == ''){
        clickedItem.outerHTML =  `<p class="text " data-job="edit" id="${id}">${newInput.value}</p>`;
        } else {
          clickedItem.outerHTML =  `<p class="text " data-job="edit" id="${id}">${newInputValue}</p>`;
        }
        newtitle = newInput.value;
    
        fetch(`http://195.181.210.249:3000/todo/${id}`, {
	      method: 'PUT',
	      headers: {
          'Content-Type': 'application/json',
  	      },
  	    body: JSON.stringify({
          title : newtitle
        }),
        })
        .then((response) => response.json())
        .then((list) => {
        console.log('Success:', list);
        })
        .catch((error) => {
	      console.error('Error:', error);
        });
    }
  };
});