function Todo(name, state) {
    this.name = name;
    this.state = state;
  }
  
  var todos = JSON.parse(localStorage.getItem("todos"))||[];
  var states = ["active", "inactive", "done"];
  var tabs = ["all"].concat(states);
  var currentTab = "all";
  
  var form = document.getElementById("new-todo-form");
  var input = document.getElementById("new-todo-title");
  
  form.onsubmit = function(event) {
    event.preventDefault();
    if (input.value && input.value.length) {
      todos.push(new Todo(input.value,"active"));
      input.value = "";

      //update local storage
      localStorage.setItem("todos",JSON.stringify(todos));
      renderTodos();
    }
  };
  
  var buttons = [
    { action: "done", icon: "ok" },
    { action: "active", icon: "plus" },
    { action: "inactive", icon: "minus" },
    { action: "moveUp", icon: "arrow-up" },
    { action: "moveDown", icon: "arrow-down" },
    { action: "remove", icon: "trash" }
  ];
  function renderTodos() {
    var todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";
    todos
      .filter(function(todo) {
        return todo.state === currentTab || currentTab === "all";
      })
      .forEach(function(todo) {
        var div1 = document.createElement("div");
        div1.className = "row";
  
        var div2 = document.createElement("div");
        div2.innerHTML =
          '<a class="list-group-item" href="#">' + todo.name + "</a>";
        div2.className = "col-xs-6 col-sm-9 col-md-10";
  
        var div3 = document.createElement("div");
        div3.className = "col-xs-6 col-sm-3 col-md-2 btn-group text-right";
        buttons.forEach(function(button) {
          var btn = document.createElement("button");
          btn.className = "btn btn-default btn-xs";
          btn.innerHTML =
            '<i class="glyphicon glyphicon-' + button.icon + '"></i>';
          div3.appendChild(btn);
  
          if (button.action === todo.state) {
            btn.disabled = true;
          }
  
          if (button.action === "remove") {
            btn.title = "Remove";
            btn.onclick = function() {
              if (
                confirm(
                  "Are you sure you want to delete the item titled " + todo.name
                )
              ) {
                todos.splice(todos.indexOf(todo), 1);

                //update local storage
                localStorage.setItem("todos",JSON.stringify(todos));
                renderTodos();
              }
            };
          } else if(button.action === "moveUp"){
            btn.title = "moveUp";
            btn.onclick = function(){
              if(todos.indexOf(todo)!=0){
                swapTodos(todos[todos.indexOf(todo)],todos[todos.indexOf(todo)-1])

                //update local storage
                localStorage.setItem("todos",JSON.stringify(todos));
                renderTodos();
              }
            }
          }
          else if(button.action === "moveDown"){
            btn.title = "moveDown";
            btn.onclick = function(){
            if(todos.indexOf(todo)!=(todos.length-1)){
              swapTodos(todos[todos.indexOf(todo)],todos[todos.indexOf(todo)+1])

              //update local storage
              localStorage.setItem("todos",JSON.stringify(todos));
              renderTodos();
            }
          }
          }else{
            btn.title = "Mark as " + button.action;
            btn.onclick = function() {
              todo.state = button.action;

              //update local storage
              localStorage.setItem("todos",JSON.stringify(todos));
              renderTodos();
            };
          }
        });
  
        div1.appendChild(div2);
        div1.appendChild(div3);
  
        todoList.appendChild(div1);
      });

      var activeNum=0;
      var inactiveNum=0;
      var doneNum=0;

      todos.forEach((todo)=>{
        switch(todo.state){
          case "active": 
            activeNum++;
            break;
          case "inactive":
            inactiveNum++;
            break;
          case "done":
            doneNum++;
            break;
        }
      })

      //update badges
      var todoTabs = document.getElementsByClassName("todo-tab");
      for(var i=0; i<todoTabs.length; i++){
        var tabName = todoTabs[i].getAttribute("data-tab-name");
        switch(tabName){
          case "all":
            todoTabs[i].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML = todos.length;
            break;
          case "active":
            todoTabs[i].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML = activeNum;
            break;
          case "inactive":
            todoTabs[i].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML = inactiveNum;
            break;
          case "done":
            todoTabs[i].getElementsByTagName("a")[0].getElementsByTagName("span")[0].innerHTML = doneNum;
            break;
        }
      }
      
  }
  
  renderTodos();
  
  function selectTab(element) {
    var tabName = element.attributes["data-tab-name"].value;
    currentTab = tabName;
    var todoTabs = document.getElementsByClassName("todo-tab");
    for (var i = 0; i < todoTabs.length; i++) {
      todoTabs[i].classList.remove("active");
    }
    element.classList.add("active");
    renderTodos();
  }

  function swapTodos(todo1, todo2){
    var previousTodo = new Todo(todo2.name,todo2.state)
    var currentTodo = new Todo(todo1.name, todo1.state);

    todo1.name = previousTodo.name
    todo1.state = previousTodo.state

    todo2.name = currentTodo.name;
    todo2.state = currentTodo.state;
  }