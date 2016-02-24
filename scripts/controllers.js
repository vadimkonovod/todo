$(function(){
    $(document)
        .on('keypress', '.new-todo', function(e) {
            if (e.which === ENTER_KEY && this.value.trim()) {
                services.createToDo(this.value.trim());
                this.value = '';
            }
        })
        .on('click', '.toggle', function() {
            $(this).closest('li').toggleClass('completed');
            var id = $(this).closest('li').attr('id');
            services.completeToDo(id);
        })
        .on('click', '.destroy', function() {
            var id = $(this).closest('li').attr('id');
            $(this).closest('li').remove();
            services.deleteToDo(id);
        })
        .on('click', '.clear-completed', function() {
            services.clearComplited();
        })
        .on('click', '.toggle-all', function() {
            services.toggleAll();
        })
        .on('dblclick', 'label', function() {
            var $li = $(this).closest('li');
            $li.addClass('editing');
            $('.edit', $li).focus();
        })
        .on('keypress', '.edit', function(e) {
            if (e.which === ENTER_KEY) {
                services.close.call(this);
            }
        })
        .on('blur', '.edit', function() {
            services.close.call(this);
        })
        .on('keydown', '.edit', function (e) {
            if (e.which === ESC_KEY) {
                services.revertOnEscape.call(this);
            }
        });
});