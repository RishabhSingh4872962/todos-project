const todoName = document.getElementById("todoName");
const deadline = document.getElementById("deadline");
const piority = document.getElementById("piority");
const todayTodos = document.getElementById("todayTodos");
const futureTodos = document.getElementById("futureTodos");
const completedTodos = document.getElementById("completedTodos");
const addTodo = document.getElementById("addTodo");

let todayDate = new Date().toLocaleDateString();

localStorage.setItem(
  "todos",
  JSON.stringify([
    {
      id: 1,
      todoName: "complete the project",
      deadline: new Date().toLocaleDateString(),
      piority: "high",
      completed: false,
    },
    {
      id: 2,
      todoName: "project complete",
      deadline: "28/03/2024",
      piority: "medium",
      completed: true,
    },
    {
      id: 3,
      todoName: "get a bike",
      deadline: "31/03/2024",
      piority: "high",
      completed: false,
    },
  ])
);

let id = 4;

let todos = JSON.parse(localStorage.getItem("todos"));
const priorityOrder = {
  low: 1,
  medium: 2,
  high: 3,
};

// Custom sorting function
function comparePriority(todo1, todo2) {
  return priorityOrder[todo1.priority] - priorityOrder[todo2.priority];
}

// Sort the todos array by priority

console.log(todos);
function deleteTodo(e) {
  const id = e.target.parentElement.parentElement.id;
  e.target.parentElement.parentElement.remove();
  todos.splice(
    todos.findIndex((obj) => obj.id == id),
    1
  );
  todos.sort(comparePriority);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function handleSubmit() {
  let todoDate = deadline.value
    .split("-")
    .reverse()
    .map((ele) => Number(ele));
  let currentDate = todayDate.split("/").map((ele) => Number(ele));
  if (
    todoDate[2] <= currentDate[2] &&
    todoDate[1] <= currentDate[1] &&
    todoDate[0] < currentDate[0]
  ) {
    return alert("Enter the today's date or the future date");
  }

  let todo = {
    id: id++,
    todoName: todoName.value,
    deadline: deadline.value
      ? new Date(deadline.value).toLocaleDateString()
      : todayDate,
    piority: piority.value ? piority.value : "low",
    completed: false,
  };
  todos.push(todo);
  // sort todo
  todos.sort(comparePriority);

  appendTodo(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoName.value = "";
  deadline.value = "";
  piority.value = "";
}

function createAppendTodo(todo, container, addClass, comp) {
  const div = document.createElement("div");
  div.id = todo.id;
  div.className = "todo";
  if (comp) {
    div.classList.add("todo-completed");
  }
  const name = document.createElement("p");
  name.innerHTML = `${todo.id}. ${todo.todoName}`;

  const date = document.createElement("p");
  date.innerHTML = `${todo.deadline}`;
  const piorityStr = document.createElement("p");
  piorityStr.innerHTML = `piority:${todo.piority}`;

  const delBtn = document.createElement("button");
  delBtn.innerText = "Delete";
  delBtn.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>`;
  delBtn.addEventListener("click", deleteTodo);

  let completed;
  if (todo.completed == false) {
    completed = document.createElement("input");
    completed.type = "checkbox";
    completed.onclick=handleCheck
    div.append(name, date, piorityStr, completed, delBtn);
  } else {
    div.append(name, date, piorityStr, delBtn);
  }
  if (addClass == "true") {
    div.classList.add("expire");
  }
  container.appendChild(div);
}

function handleCheck(e){
if (e.target.checked) {
    console.log(e.target.parentElement.id)
    
      let todo=  todos.find((obj) => obj.id == e.target.parentElement.id);
      todo.completed=true
      localStorage.setItem("todos", JSON.stringify(todos));
}
todayTodos.innerHTML=""
futureTodos.innerHTML=""
completedTodos.innerHTML=""
renderTodos(todos)
}

function appendTodo(todo) {
  const todoDate = todo.deadline.split("/").map((ele) => Number(ele));
  const currentDate = todayDate.split("/").map((ele) => Number(ele));
  console.log(todoDate, currentDate);
  if (todayDate == todo.deadline) {
    createAppendTodo(todo, todayTodos);
  } else if (
    todoDate[2] <= currentDate[2] &&
    todoDate[1] <= currentDate[1] &&
    todoDate[0] < currentDate[0]
  ) {
    createAppendTodo(todo, futureTodos, "true");
  } else {
    createAppendTodo(todo, futureTodos);
  }
}

function renderTodos(todosList) {
  //sort todo
  todos.sort(comparePriority);
  todosList.forEach((todo) => {
    const date = `${todo.deadline[0]}${todo.deadline[1]}`;
    if (todo.deadline == todayDate && todo.completed == false) {
      createAppendTodo(todo, todayTodos);
    } else if (
      `${date}` > `${todayDate[0]}${todayDate[1]}` &&
      todo.completed == false
    ) {
      createAppendTodo(todo, futureTodos);
    } else {
      createAppendTodo(todo, completedTodos, "false", "true");
    }
  });
}
renderTodos(todos);
