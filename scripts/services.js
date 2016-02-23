services = (function() {

    var itemTemplate = $('#item-template').html();
    var statsTemplate = $('#stats-template').html();

    function init() {
        if (!localStorage.todos) {
            $(".main").hide();
            $(".footer").hide();
            $(".clear-completed").hide();
        } else {
            $(".footer").html(statsTemplate);
            $(".footer .todo-count").html(itemsLeft(getAll()));
            render();
        }
    }

    function render() {
        var todos = getAll();

        for(var key in todos) {
            $(".todo-list").append(itemTemplate);
            $(".todo-list li:last-child").attr("id", todos[key].id);
            $(".todo-list li:last-child label").text(todos[key].title);
            if (todos[key].completed) {
                $(".todo-list li:last-child").addClass('completed');
                $('.todo-list li:last-child .toggle').prop('checked', true)
            }
        }
            
        if (hasCompleted(todos)) {
            $(".clear-completed").show();
        } else {
            $(".clear-completed").hide();
        }
    }

    function createToDo(todo) {
        var todos = getAll();

        if (Object.keys(todos).length == 0) {
            $(".main").show();
            $(".footer").show();
            $(".footer").html(statsTemplate);
            $(".footer .todo-count").html("1 item left");
            $(".clear-completed").hide();
        }

        var id = guid();
        var order = getOrder(todos);
        todos[id] = {"title": todo, "id": id, "order": order, "completed": false};
        localStorage.setItem("todos", JSON.stringify(todos));
        $(".todo-list").append(itemTemplate);
        $(".todo-list li:last-child").attr("id", id);
        $(".todo-list li:last-child label").text(todo);
        $(".footer .todo-count").html(itemsLeft(todos));
    }

    function completeToDo(id) {
        var todos = getAll();
        todos[id].completed = !todos[id].completed;
        localStorage.setItem("todos", JSON.stringify(todos));
        $(".footer .todo-count").html(itemsLeft(todos));
            
        if (hasCompleted(todos)) {
            $(".clear-completed").show();
        } else {
            $(".clear-completed").hide();
        }
    }

    function deleteToDo(id) {
        var todos = getAll();

        if (Object.keys(todos).length == 1) {
            localStorage.removeItem('todos');
            $(".main").hide();
            $(".footer").hide();
        } else {
            delete todos[id];
            localStorage.setItem("todos", JSON.stringify(todos));
            $(".footer .todo-count").html(itemsLeft(todos));
        }
        
        if (hasCompleted(todos)) {
            $(".clear-completed").show();
        } else {
            $(".clear-completed").hide();
        }
    }

    function clear() {
        var todos = getAll();
        for (var key in todos) {
            if (todos[key].completed) {
                delete todos[key];
            }
        }

        if (Object.keys(todos).length > 0) {
            localStorage.setItem("todos", JSON.stringify(todos));
        } else {
            localStorage.removeItem('todos')
        }
        $(".todo-list").empty();
        init();
    }

    function itemsLeft(todos) {
        var i = 0;
        for(var key in todos) {
            if (!todos[key].completed) {
                i = i + 1;
            }
        }
        return (i + ((i === 1) ? ' item' : ' items') + ' left');
    }

    function hasCompleted(todos) {
        for (var key in todos) {
            if (todos[key].completed) {
                return true
            }
        }
        return false;
    }

    function getOrder(todos) {
        if (Object.keys(todos).length > 0) {
            var keys = Object.keys(todos);
            var last = keys[keys.length-1];
            return todos[last].order + 1;
        } else {
            return 1;
        }
    }

    function getAll() {
        var todos = {};
        if (!localStorage.todos) {
            return todos;
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
            if (todos.length > 1) {
                todos.sort(function(a, b) {
                    return parseFloat(a[order]) - parseFloat(b[order]);
                });
            }
            return todos;
        }
    }

    function s4() {
        return (((1 + Math.random()) * 0x10000)|0).toString(16).substring(1);
    };

    function guid() {
       return (s4() + s4() + "-" + s4());
    };

    return {
        init : init,
        createToDo : createToDo,
        completeToDo : completeToDo,
        deleteToDo : deleteToDo,
        clear : clear
    }
}());