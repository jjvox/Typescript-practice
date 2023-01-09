class TodoApp {
  /**
   * @constructs TodoApp
   */
  constructor() {

  }
  /**
   * 할 일을 추가 할 수 있다.
   * 
   * @param {string} text 
   */
  addTodo(text) {

  }
  /**
   * 모든 할 일을 조회 할 수 있다.
   * @returns {Todo[]} 전체 할 일
   */
  getTodoList() {
  }

  /**
   * 모든 할 일을 필터링 하여 조회 할 수 있다.
   * @param {string} filterType
   * @returns {Todo[]} 필터링 된 할 일
   */

  getTodoListByFilter(filterType) {

  }

  /**
   * 할 일의 내용을 수정 할 수 있다.
   * 할 일의 상태를 수정 할 수 있다. 
   *  @param {Object} todo - 수정 될 할 일
   *  @param {string} [todo.text] - 수정 될 내용
   *  @param {string} [todo.status] - 수정 될 상태
   */
  updateTodo({id, text, status}) {

  }

  /**
   * 
   * 특정 할 일을 제거 할 수 있다.
   * @param {number} id 
   */

  removeTodo(id) {

  }

}