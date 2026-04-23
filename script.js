document.addEventListener('DOMContentLoaded', () => {
    const tasks = document.querySelectorAll('.task');
    const columns = document.querySelectorAll('.column-content');
    const addTaskBtn = document.getElementById('add-task-btn');

    // 1. Initialize Drag and Drop for existing tasks
    tasks.forEach(task => {
        addDragEvents(task);
    });

    // 2. Set up Drop Zones (Columns)
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault(); // Necessary to allow dropping
            column.classList.add('drag-over');
            
            // Determine where to place the element being dragged
            const afterElement = getDragAfterElement(column, e.clientY);
            const draggable = document.querySelector('.dragging');
            
            if (afterElement == null) {
                column.appendChild(draggable);
            } else {
                column.insertBefore(draggable, afterElement);
            }
        });

        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', () => {
            column.classList.remove('drag-over');
        });
    });

    // 3. Add New Task Functionality
    addTaskBtn.addEventListener('click', () => {
        const taskText = prompt('Enter task description:');
        if (taskText && taskText.trim() !== '') {
            const newTask = document.createElement('div');
            newTask.classList.add('task');
            newTask.setAttribute('draggable', 'true');
            newTask.innerText = taskText;
            
            addDragEvents(newTask);
            
            // Append to the "To Do" column by default
            document.querySelector('#todo .column-content').appendChild(newTask);
        }
    });

    // Helper Function: Attach drag events to a task
    function addDragEvents(task) {
        task.addEventListener('dragstart', () => {
            task.classList.add('dragging');
        });

        task.addEventListener('dragend', () => {
            task.classList.remove('dragging');
        });
    }

    // Helper Function: Determine the position to drop the task
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
