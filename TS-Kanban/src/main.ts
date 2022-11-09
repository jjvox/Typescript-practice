import { v4 as uuidv4 } from 'uuid';

import { defaultKanban } from './mock'
import type { TodoList, inProgressTodo } from './type'
import { cardTemplate } from './templates/card'
import { addListButtonTemplate } from './templates/addListButtonTemplate';
import './style.css'


class KanbanApp {

  list: TodoList[];

  constructor(data: TodoList[]) {
    this.list = data;

    this.render();
    this.attachEvent();
  }

  render() {
    const addListButton = document.createElement('button');
    addListButton.classList.add('board', 'add');
    addListButton.innerHTML = '<span class="plus-btn blue"></span>';

    const board = document.querySelector('.todo-container'); // <main></main> 을 가져옴

    if (board) {
      board.innerHTML = '';   //render전 main을 한번 비워준다. 
      

      const fragment = document.createDocumentFragment(); 
      // createDocumentFragement() 다른 노드를 담는 임시 컨테이너 역할을 하는 특수 목적의 노드이다. 
      //가상의 노드 객체로서, 메모리상에서만 존재하는 비 문서 탬플릿
      const listElements = this.list.map((list) => this.generateList(list));

      fragment.append(...listElements); 
      board.append(fragment, addListButton) // appendChild는 한개의 노드만 받는 반면 append는 여러개의 노드 또는 텍스트를 받을수 있다. 
    }
  
  }


  attachEvent() {
    const $addListButton = document.querySelector('.board.add');
    const $removeListButton = document.querySelectorAll('.kanban-delete');
    const $addTodoButton = document.querySelectorAll('.todo-item.add');
    const $removeTodoButton = document.querySelectorAll('.delete-item');
    const $addTagButton = document.querySelectorAll('.add-btn'); // 태그 추가 버튼
    const $removeTagButton = document.querySelectorAll('.delete-tag');

    $addListButton?.addEventListener('click', () => {
      const newId = uuidv4();
      
      this.list = [
        ...this.list,
        {
          id: newId,
          title: `kanban-${newId}`,
          list: [],
        },
      ];

      this.render();
      this.attachEvent();
      
    });

    $removeListButton.forEach((button) => {
      button.addEventListener('click', ({currentTarget}) => {
        const selectedId = (currentTarget as HTMLButtonElement).id.split('kanban-')[1];
        
        this.removeList(selectedId)
      });
    });

    $addTodoButton.forEach((button) => {
      button.addEventListener('click', ({currentTarget}) => {
        if (currentTarget instanceof HTMLButtonElement) {
          const category = currentTarget.id.split('add-todo-')[1];

          currentTarget.closest('.wrapper')?.prepend(this.addTodo(category));
        }
      })
    })

    $removeTodoButton.forEach((button) => {
      button.addEventListener('click', ({currentTarget}) => {
        if(currentTarget instanceof HTMLButtonElement) {
          const category = currentTarget.closest('.todo')?.id.split('+')[0];
          const selectedId = currentTarget.id.split('delete-todo-')[1];

          this.removeTodo(selectedId, category);
        }
      })
    })

    $addTagButton.forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {  // 태그추가 버튼 'click'
        if (!(currentTarget instanceof HTMLButtonElement)) {
          return;
        }

        const category = currentTarget.closest('.todo')?.id.split('+')[0]; // click한 태그가 포함 된 list의 title을 가져옴.
        const selectedId = currentTarget.id.split('todo-')[1];  // 선택한 태그의 id를 가져 옴 

        const listId = this.list.findIndex((list) => list.title === category); // 전체 리스트에서, 클릭 한 것과 같은 title을 가진 list의 index값을 찾음
        const targetList = this.list.find((list) => list.title === category); // 전체 리스트에서, 클릭 한 것과 같은 title을 가진 list를 찾음

        const todo = targetList?.list.find((todo) => todo.id === selectedId); // 찾은 list 에서, 클릭 한 것과 같은 id 값을 가진 todo를 찾는다. 
        const todoIndex = targetList?.list.findIndex((todo) => todo.id === selectedId); // 찾은 list 에서, 클릭 한 것과 같은 id 값을 가진 todo의 index값을 찾는다. 

        const tagContent = currentTarget.closest('.tag')?.querySelector('span')?.textContent; // 태그에 입력한 내용을 가져온다. 

        todo?.tags?.push({ //todo에 있는 tag 배열에 새로운 id값과 입력한 content를 push한다 
          id: uuidv4(),
          content: tagContent ?? '태그',
        });

        if (todoIndex && todo) {  
          this.list[listId].list.splice(todoIndex, 1, todo);  //  기존에 있던 tag입력창을 제거하고 새로 만든 todo를 넣는다. 
        }

        this.render();
        this.attachEvent();
      })
    }) // tag하나 만드는데 이렇게 복잡할줄 몰랐따.....


    $removeTagButton.forEach((button) => {
      button.addEventListener('click', ({ currentTarget }) => {  // 태그삭제 버튼 'click'
        if (!(currentTarget instanceof HTMLButtonElement)) {
          return;
        }

        const category = currentTarget.closest('.todo')?.id.split('+')[0]; // click한 태그가 포함 된 list의 title을 가져옴.
        const listId = this.list.findIndex((list) => list.title === category); // 전체 리스트에서, 클릭 한 것과 같은 title을 가진 list의 index값을 찾음
        const targetList = this.list.find((list) => list.title === category); // 전체 리스트에서, 클릭 한 것과 같은 title을 가진 list를 찾음

        const selectedTodoId = currentTarget.closest('.todo')?.id.split('+')[1];  // 삭제할 태그의 todo의 id를 가져 옴.
        const selectedTagId = currentTarget.id.split('todo-delete-')[1];  // 삭제할 태그의 id를 가져 옴.

        if (targetList) {
          const todo = targetList?.list.find((todo) => todo.id === selectedTodoId); // 찾은 list 에서, 클릭 한 것과 같은 id 값을 가진 todo를 찾는다. 
          const todoIndex = targetList?.list.findIndex((todo) => todo.id === selectedTodoId); // 찾은 list 에서, 클릭 한 것과 같은 id 값을 가진 todo의 index값을 찾는다. 
          
          const newTags = todo?.tags?.filter((tag) => tag.id !== selectedTagId); // 해당 todo에 filter로 선택된 tag를 제외한 새로운 tag배열을 만든다. 
          
          this.list[listId].list[todoIndex].tags = newTags; // 새로운 배열을 할당한다.  

          this.render();
          this.attachEvent();
        }
      });
    });    
  };

  addTodo(category: string) {
    
    const $list = document.createElement('section')
    $list.classList.add('todo');
    $list.setAttribute('id', 'add-item');

    $list.innerHTML = cardTemplate(); // Template로 따로 만들어줌. 

    $list.querySelector('.add')?.addEventListener('click', ({currentTarget}) => {
      const listId = this.list.findIndex(({title}) => title === category);

      if (currentTarget instanceof HTMLButtonElement) { 
        const $todo = currentTarget.closest('.todo-item');
        const title = $todo?.querySelector('.add-title')?.textContent;
        const body = $todo?.querySelector('.add-content')?.textContent;

        const newTodo: inProgressTodo = {
          id: uuidv4(),
          content: {
            title: title ?? '',
            body: body ?? '',
          },
          isDone: false,
          category: category,
          tags: [],
        };

        this.list[listId].list = [...this.list[listId].list, newTodo];

        this.render();
        this.attachEvent();
      }
    });
    return $list
  }

  removeTodo(selectedId: string, category: string|undefined) {
    const listId = this.list.findIndex((list) => list.title === category);
    const targetList = this.list.find((list) => list.title === category);

    if (targetList) {
      this.list[listId].list = targetList.list.filter((todo) => todo.id !== selectedId);
      this.render();
      this.attachEvent();
    }
  }

  
  removeList(selectedId: string) {
    this.list = this.list.filter((list) => list.id !== selectedId);
    this.render(); 
    this.attachEvent();
  }


  generateList( {id, title, list}: TodoList) {
    const $list = document.createElement('section');
    $list.classList.add('board');

    const addButtonElement = addListButtonTemplate(title);

    const listHTML = list?.map(({id: todoId, content, tags}) => {
      return `
      <section class='todo' id='${title}+${todoId}'>
        <div class='todo-item'>
          <div class='wrapper'>
            <div class='item-header'>
              <div class='item-title'>
                <span class='item-title-icon'></span>
                <div class='title'>${content ? content.title : ''}</div>
              </div>
              <div class='todo-control'>
                <button class='delete-item' id='delete-todo-${todoId}'>
                  <span class='delete-btn'></span>
                </button>
              </div>
            </div>

            <div class='todo-content'>${content ? content.body : ''}</div>
          </div>

          <div class='tags'>
            ${
              tags &&
              tags
                .map(({ id: tagId, content }) => {
                  return `<span class='tag' id='tag-${tagId}'>
                          ${content}
                          <button class='delete-tag delete-btn' id='todo-delete-${tagId}'></button>
                        </span>`;
              })
              .join('')
            }

            <div class='tag add-tag-btn'>
              <span contentEditable>태그</span>
              <button class='add-btn' id='todo-${todoId}'></button>
            </div>
          
            </div>
          </div>
        </section>
      `;
    })
    .join(''); // map은 배열로 반환 하기 때문에 마지막에 join('') 을 이용해서 string으로 만들어 준다. 

  const $item = `
    <section class='board-title'>
      <div class='board-header'>
        <div class='total'><span id='todo-count'>${list.length}</span></div>
        <h2 class='title'>${title}</h2>
      </div>
        
      <div class='board-control'>
        <button class='kanban-delete' id='kanban-${id}'><span class='delete-btn'></span></button>
      </div>
    </section>
    
    <div class='wrapper'>
      ${addButtonElement}
      ${list.length ? listHTML : ''}
    </div>`;  

    $list.innerHTML = $item;

    return $list;
  };

};

new KanbanApp(defaultKanban);


// 네이밍 중요. 
// 네이밍을 중복되게 하니 햇갈려 죽을뻔 했다. 이름이 같은데 서로 가리키는게 다르다니!! 절대 해서는 안될것. 
// 네이밍은 절대 헷갈리지 않게!

// 마찬가지로 class와 id의 네이밍도 중요. 하눈에 보기 쉽게 또는 일관된 규칙을 가지고 이름을 정해야 한다.

// 이번 구현은 네이밍 때문에 정말 헷갈려서 고생 했는데 구현 다 끝나고 강의 마지막에 네이밍을 이렇게 하면 안된다고 다 수정 하심 ㅜㅜ..
// class랑 id 이름도 본인이 제대로 못한거 같다고 미안하다고 하셨다... 
// 후.. 덕분에 헷갈려서 머리아파 힘들었지만 정말 좋은 경험 직접 한것 같음.

// 참고로 난 수정을 일부러 안했다. 하나의 사례로 보려고...
// 또한 여러 템플릿으로 나눠서 모듈화도 했었는데 아직 코드가 여러군데 나눠져 잇으면 한눈에 보기 힘든 초보자라 모듈화는 최소한으로 했다.
// 코드가 좀 길고 지저분해 보여도 아직 나는 한곳에 풀어져서 있는게 좀더 연습하고 익히기엔 좋다고 생각.
// 추후 익숙해 지면 모듈화 시키고 중복되는것들 합하는 연습은 따로 해야 겠다. 