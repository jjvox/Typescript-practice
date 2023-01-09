export function cardTemplate() {
  return `<div class="todo-item add-item">
    <div>
      <div class="item-header">
        <div class="item-title">
          <span class="item-title-icon"></span>
          <div class="title add-title" contenteditable>제목</div>
        </div>
      </div>
      <div class="todo-content add-content" contenteditable>내용</div>
    </div>
    <div class="todo-control">
      <button class="cancel">Cancel</button>
      <button class="add">Add Item</button>
    </div>
  </div>
  `;
}