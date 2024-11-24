$(document).ready(function () {
    loadTasks();

    $('#todo-form').submit(function (e) {
        e.preventDefault();
        let taskElement = $('#todo-input');
        let taskText = taskElement.val();
        addTask(taskText);
        taskElement.val('');
    });

    $(document).on('click', '.toggle-complete', function () {
        let id = $(this).closest('li').data('id');
        toggleComplete(id);
    });

    $(document).on('click', '.delete-task', function () {
        let id = $(this).closest('li').data('id');
        deleteTask(id);
    });

    $(document).on('click', '.edit-task', function () {
        let id = $(this).closest('li').data('id');
        let tasks = getTasks();
        let task = tasks.find(task => task.id === id);
        $('#edit-id').val(task.id);
        $('#edit-text').val(task.text);
        $('#edit-modal').modal('show');
    });

    $('#edit-form').submit(function (e) {
        e.preventDefault();
        let id = parseInt($('#edit-id').val());
        let text = $('#edit-text').val();
        updateTask(id, text);
        $('#edit-modal').modal('hide');
    });

    function loadTasks() {
        let tasks = getTasks();
        $('#todo-list').empty();
        $.each(tasks, function (index, task) {
            $('#todo-list').append(
                `<li class="list-group-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <span class="task-text">${task.text}</span>
                    <div>
                        <button class="btn btn-sm btn-success toggle-complete">${task.completed ? 'Desmarcar' : 'Concluir'}</button>
                        <button class="btn btn-sm btn-info edit-task">Editar</button>
                        <button class="btn btn-sm btn-danger delete-task">Excluir</button>
                    </div>
                </li>`
            );
        });
        updateCount();
    }

    function updateCount() {
        let tasks = getTasks();
        let pendingTasks = tasks.filter(task => !task.completed).length;
        $('#todo-count').text(pendingTasks);
    }

    function getTasks() {
        let tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function addTask(text) {
        let tasks = getTasks();
        let id = tasks.length > 0 ? parseInt(tasks[tasks.length - 1].id) + 1 : 1;
        tasks.push({id: id, text: text, completed: false});
        saveTasks(tasks);
        loadTasks();
    }

    function toggleComplete(id) {
        id = parseInt(id);
        let tasks = getTasks();
        $.each(tasks, function (index, task) {
            if (task.id === id) {
                task.completed = !task.completed;
            }
        });
        saveTasks(tasks);
        loadTasks();
    }

    function deleteTask(id) {
        id = parseInt(id);
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        loadTasks();
    }

    function updateTask(id, text) {
        id = parseInt(id);
        let tasks = getTasks();
        $.each(tasks, function (index, task) {
            if (task.id === id) {
                task.text = text;
            }
        });
        saveTasks(tasks);
        loadTasks();
    }
});
