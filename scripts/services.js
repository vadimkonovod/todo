services = (function() {

    var itemTemplate = $('#item-template').html();
    var statsTemplate = $('#stats-template').html();
    var currentFilter = $('.filters li a[href="#/"]');

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
        disableBtnToggleAll(getAll());
    }

    function render() {
        var todos = getAll();

        for(var key in todos) {
            $(".todo-list").append(itemTemplate);
            $(".todo-list li:last-child").attr("id", todos[key].id);
            $(".todo-list li:last-child label").text(todos[key].title);
            $(".todo-list li:last-child .edit").val(todos[key].title);
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
        disableBtnToggleAll(todos);
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
        $(".todo-list li:last-child .edit").val(todo);
        $(".footer .todo-count").html(itemsLeft(todos));
        disableBtnToggleAll(todos);
        doFilter(currentFilter);
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
        disableBtnToggleAll(todos);
        doFilter(currentFilter);
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
        disableBtnToggleAll(todos);
    }

    function clearComplited() {
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
            $('.toggle-all').prop('checked', false);
        }
        $(".todo-list").empty();
        init();
        disableBtnToggleAll(todos);
        doFilter(currentFilter);
    }

    function toggleAll() {
        var todos = getAll();
        if ($('.toggle-all').prop('checked')) {
            $('.todo-list li').each(function(index) {
                $(this).addClass('completed');
                $('.toggle', this).prop('checked', true)
                todos[$(this).attr('id')].completed = true;
            });
        } else {
            $('.todo-list li').each(function(index) {
                $(this).removeClass('completed');
                $('.toggle', this).prop('checked', false)
                todos[$(this).attr('id')].completed = false;
            });
        }
        localStorage.setItem("todos", JSON.stringify(todos));
        $(".footer .todo-count").html(itemsLeft(todos));
        
        if (hasCompleted(todos)) {
            $(".clear-completed").show();
        } else {
            $(".clear-completed").hide();
        }
        doFilter(currentFilter);
    }

    function close() {
            var value = this.value;
            var trimmedValue = value.trim();

            var $li = $(this).closest('li');

            if (!($li.hasClass('editing'))) {
                return;
            }

            var id = $li.attr('id');

            if (trimmedValue) {
                var todos = getAll();
                todos[id].title = trimmedValue;
                localStorage.setItem("todos", JSON.stringify(todos));

                $("label", $li).text(trimmedValue);
                $(".edit", $li).val(trimmedValue);
            } else {
                $li.remove();
                services.deleteToDo(id);
            }

            $li.removeClass('editing');
    }

    function doFilter(select) {
        $('.filters li a').removeClass('selected');
        $(select).addClass('selected');
        if ($(select).attr('href') == '#/active') {
            $('.todo-list li.completed').hide();
            $(".todo-list li:not(.completed)").show();
        } else if ($(select).attr('href') == '#/completed') {
            $('.todo-list li.completed').show();
            $(".todo-list li:not(.completed)").hide();
        } else {
            $('.todo-list li').show();
        }
        currentFilter = select;
    }

    function revertOnEscape() {
        var $li = $(this).closest('li');
        $li.removeClass('editing');
        var id = $li.attr('id');
        var todos = getAll();
                
        $("label", $li).text(todos[id].title);
        $(".edit", $li).val(todos[id].title);
    }


    function disableBtnToggleAll(todos) {
        for (var key in todos) {
            if (!todos[key].completed) {
                $('.toggle-all').prop('checked', false);
                return;
            }
        }
        $('.toggle-all').prop('checked', true);
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
                return true;
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
        clearComplited : clearComplited,
        toggleAll : toggleAll,
        close: close,
        revertOnEscape : revertOnEscape,
        doFilter : doFilter
    }
}());