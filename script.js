document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.getElementById('add-task-btn');
    const dropZones = document.querySelectorAll('.drop-zone');

    // Initial Data
    const initialTasks = [
        { id: 1, text: "Structure Q3 Financial Report", status: "todo" },
        { id: 2, text: "Audit Lead Gen Funnel", status: "inprogress" },
        { id: 3, text: "Client Onboarding: Early Edge", status: "done" }
    ];

    // Load Initial State
    initialTasks.forEach(task => createTaskElement(task.text, task.status));
    updateCounts();

    addBtn.addEventListener('click', () => {
        const text = prompt("Enter task title:");
        if (text && text.trim()) {
            createTaskElement(text, 'todo');
            updateCounts();
        }
    });

    function createTaskElement(text, columnId) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.draggable = true;
        card.innerText = text;

        card.addEventListener('dragstart', () => card.classList.add('dragging'));
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            updateCounts();
        });

        document.querySelector(`#${columnId} .drop-zone`).appendChild(card);
    }

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('active');
            const draggingCard = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(zone, e.clientY);
            
            if (afterElement == null) {
                zone.appendChild(draggingCard);
            } else {
                zone.insertBefore(draggingCard, afterElement);
            }
        });

        zone.addEventListener('dragleave', () => zone.classList.remove('active'));
        zone.addEventListener('drop', () => zone.classList.remove('active'));
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];
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

    function updateCounts() {
        document.querySelectorAll('.column').forEach(col => {
            const count = col.querySelectorAll('.task-card').length;
            col.querySelector('.task-count').innerText = count;
        });
    }
});
