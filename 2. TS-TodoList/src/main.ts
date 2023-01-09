import './style.css'

interface Todo {
  id: number;
  content: string;
  isDone: boolean;
}

let todoList: Todo[] = []; // Todo list를 담을 배열. 
let changeTodoList: Todo[] = [];
let btNumber = 0;


  

function initEvent() { 
  const inputEl = document.querySelector('#todo-input');
  inputEl?.addEventListener('keydown', addTodo);
  
  const controlEl = document.querySelectorAll('.control .btn');
  controlEl.forEach((item) => item.addEventListener('click', (event) => getTodoListByFilter(event)))

}

function addTodo(event: KeyboardEventInit) {    // 할일 추가하기
  if (event.key !== 'Enter') return;
  
  const target = <HTMLInputElement>(event as KeyboardEvent).target;
  
  if (!target.value) return;

  todoList.push({
    id: todoList.length+1,
    content: target.value,
    isDone: false,
  })

  target.value ='';
  render(todoList)
}

function getTodoListByFilter(filterType: Event) {
  
  const btfilter = (filterType.target as HTMLButtonElement).classList
  const active = document.querySelector('.active');

  
  if(btfilter.contains('all')) {
    
    changeTodoList = [];
    btNumber = 0;
    active?.classList.remove('active');
    btfilter.add('active');

    return render(todoList)

  } else if (btfilter.contains('complete')) {

    btNumber = 1;
    changeTodoList = todoList.filter((todo) => todo.isDone === true);
    active?.classList.remove('active');
    btfilter.add('active');

    render(changeTodoList);
    
  } else if (btfilter.contains('not-complete')) {

    btNumber = 2;
    changeTodoList = todoList.filter((todo) => todo.isDone === false);
    active?.classList.remove('active');
    btfilter.add('active');

    render(changeTodoList);
  }
};

function tabrender() {
  if(btNumber === 1){
    changeTodoList = todoList.filter((todo) => todo.isDone === true);
    render(changeTodoList);
  } else if (btNumber === 2) {
    changeTodoList = todoList.filter((todo) => todo.isDone === false);
    render(changeTodoList);
  } else render(todoList);
};


function updateTodoStatus(id: Todo['id']) {       //상태 업데이트 (해야할일 / 완료 된 일)
  const selectedIndex = todoList.findIndex((todo) => todo.id === id);
  const selectedTodo = todoList[selectedIndex];
  const newTodo = {
    ...selectedTodo,
    isDone: !selectedTodo.isDone,
  };

  todoList.splice(selectedIndex, 1, newTodo);

  tabrender()
};

function updateTodo(event: MouseEventInit, id: Todo['id']) { // 내용 수정하기
  
  const inputText = ((event as MouseEvent).target as HTMLInputElement).innerText;

  const selectedIndex = todoList.findIndex((todo) => todo.id === id);
  const selectedTodo = todoList[selectedIndex];
  const newTodo = {
    ...selectedTodo,
    content: inputText,
  };

  todoList.splice(selectedIndex, 1, newTodo);
 
  tabrender()
};


function removeTodo(id: Todo['id']) {     // 할일 제거 하기

  todoList = todoList.filter((todo) => todo.id !== id);

  tabrender()
};


function generateTodoList(todo: Todo) {   
    const containerEl = document.createElement('div')
    const todoTemplate = `<div class="item__div">
    <input type='checkbox' ${todo.isDone && 'checked'}/>
    <div class='content ${todo.isDone && 'checked'}' contentEditable>${todo.content}</div>
    <button>X</button>
    </div>`;

    containerEl.classList.add('item');
    containerEl.innerHTML = todoTemplate;

    const deleteButtonEl = containerEl.querySelector('button');
    deleteButtonEl?.addEventListener('click', () => removeTodo(todo.id));

    const contentEl = containerEl.querySelector('.content');
    contentEl?.addEventListener('blur', (event)=> updateTodo(event,todo.id));

    const checkboxEl = containerEl.querySelector('input[type=checkbox]');
    checkboxEl?.addEventListener('change', ()=> updateTodoStatus(todo.id));

    return containerEl;
  }

  function render(todoList:Todo[]) {
    const todoListEl = document.querySelector('.todo-items');
    if(todoListEl) {
      todoListEl.innerHTML = "";
    }
   
    todoList.forEach((element) => todoListEl?.appendChild(generateTodoList(element)));

    const count = document.querySelector('#todo-count');
    (count as HTMLSpanElement).innerText = `${todoList.length}`
  }



render(todoList);
initEvent();