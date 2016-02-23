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
            services.clear();
        });
});