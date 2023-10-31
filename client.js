const fetch = require("node-fetch");

async function getUser(){
 let user = await fetch("http://localhost:3000/users");
 user = await user.json();
 return user;
}

async function getTodos(user){
  let todo = await fetch(`http://localhost:3000/todos?user_id=${user.id}`);
  todo = await todo.json();
  return ({'id': user.id, 'name': user.name, 'todos': todo.todos});
}

async function fetchTodo(userData){
  let todoPromises = userData.map(user => getTodos(user));
  let todos = await Promise.all(todoPromises);
  return todos;
}

async function sleep(ms){
  return new Promise(resolve =>{
    setTimeout((ms)=>{
      resolve(ms);
    },ms)
  })
}

async function getUsersTodos(users,chunk){
  let usersTodos = [];
  for(let user = 0; user < users.length; user+=5){
    let userData = users.slice(user, user+5);
    let Todos = await fetchTodo(userData);
    usersTodos = usersTodos.concat(Todos);
    await sleep(1000);
  }
  return usersTodos;
}
function calcCompletedTodos(allTodos){
  const results = allTodos.map((todo) => ({
    id: todo.id,
    name: todo.name,
    numTodosCompleted: todo.todos.filter((todo) => todo.isCompleted).length,
  }));
  return results;
}
async function main() {
  try{
    let users = await getUser();
    let usersTodos = await getUsersTodos(users.users);
    let completedTodosWithUsers = calcCompletedTodos(usersTodos);
    console.log(completedTodosWithUsers);
  }
  catch(e){
    console.error(e);
  }
}
main();





