const form = document.getElementById("form");
const input = document.getElementById("input");
const containerList = document.getElementById("container-list");
const message = document.getElementById("msg");
message.className = "msg";

// const getPosts = async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/users");
//   const result = await response.json();
//   console.log(result);
// };
// getPosts();

//?
const FairBase_URL =
  "https://todo-app-1-7ca01-default-rtdb.firebaseio.com/alisher.json";

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputData = input.value.trim();
  if (!inputData) {
    message.textContent = "Write";
  } else {
    const newTodo = {
      title: inputData,
    };
    createTodos(newTodo);
    input.value = "";
  }
});
const createTodos = async (todo) => {
  try {
    const response = await fetch(FairBase_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    getTodos();
    const data = await response.json();
    console.log(data);
  } catch (error) {
    throw new Error(error);
  }
};
const getTodos = async () => {
  try {
    const response = await fetch(FairBase_URL);
    const result = (await response.json()) ?? {};
    const transformedTodos = Object.keys(result).reduce((acc, keys) => {
      return [...acc, { ...result[keys], id: keys }];
    }, []);
    renderTodos(transformedTodos);
  } catch (error) {
    console.log(error);
  }
};

const renderTodos = (todosArray = []) => {
  containerList.innerHTML = "";
  todosArray.map((item) => {
    const li = document.createElement("li");
    li.innerText = item.title;
    li.id = item.id;
    li.className = "list__item";
    const span = document.createElement("span");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "DELETE";
    const update = document.createElement("button");
    update.textContent = "UPDATE";
    deleteButton.addEventListener("click", () => deleteTodos(item.id));

    update.addEventListener("click", () => updateTodo(item.id, todosArray));

    span.append(deleteButton, update);
    li.appendChild(span);
    containerList.appendChild(li);
  });
};

const deleteTodos = async (id) => {
  try {
    const response = await fetch(
      `https://todo-app-1-7ca01-default-rtdb.firebaseio.com/alisher/${id}.json`,
      { method: "DELETE" }
    );
    const result = await response.json();
    getTodos();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

(() => getTodos())();

const updateTodo = async (id, arrayTodo) => {
  const newFind = arrayTodo.find((item) => item.id === id);
  input.value = newFind.title;
  input.focus();

  try {
    const response = await fetch(
      `https://todo-app-1-7ca01-default-rtdb.firebaseio.com/alisher/${id}.json`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: input.value,
        }),
      }
    );
    deleteTodos(id);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
