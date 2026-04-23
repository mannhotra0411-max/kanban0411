/**
 * Senior Developer Implementation:
 * State-driven Kanban Board with LocalStorage Persistence
 */

let state = {
    tasks: JSON.parse(localStorage.getItem('kanban-data')) || []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderBoard();
    initGlobalEvents();
});

function initGlobalEvents() {
    // Add Task
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        const text = prompt("Enter task details:");
        if (text?.trim()) {
            const newTask = {
                id: Date.now().toString(),
                text: text.trim(),
                status: 'todo'
            };
            state.tasks.push(newTask);
            saveAndSync();
        }
    });

    // Clear Done
    document.getElementById('clearDoneBtn').addEventListener('click', () => {
        if(confirm("Clear all completed tasks?")) {
            state.tasks = state.tasks.filter(t => t.status !== 'done');
            saveAndSync();
        }
    });

    // Drag and Drop Logic
    const zones = document.querySelectorAll('.drop-zone');
    zones.forEach(zone => {
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('drag-over');
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = zone.parentElement.dataset.status;
            
            updateTaskStatus(taskId, newStatus);
        });
    });
}

function updateTaskStatus(id, newStatus) {
    state.tasks = state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
    saveAndSync();
}

function deleteTask(id) {
    state.tasks = state.tasks.filter(t => t.id !== id);
    saveAndSync();
}

function editTask(id) {
    const task = state.tasks.find(t => t.id === id);
    const newText = prompt("Edit task:", task.text);
    if (newText?.trim()) {
        task.text = newText.trim();
        saveAndSync();
    }
}

function saveAndSync() {
    localStorage.setItem('kanban-data', JSON.stringify(state.tasks));
    renderBoard();
}

function renderBoard() {
    // Clear all zones
    const zones = {
        todo: document.getElementById('todo-zone'),
        inprogress: document.getElementById('inprogress-zone'),
        done: document.getElementById('done-zone')
    };

    Object.values(zones).forEach(z => z.innerHTML = '');

    // Render tasks
    state.tasks.forEach(task => {
        const card = createTaskCard(task);
        zones[task.status].appendChild(card);
    });

    // Update counts
    document.getElementById('count-todo').innerText = state.tasks.filter(t => t.status === 'todo').length;
    document.getElementById('count-inprogress').innerText = state.tasks.filter(t => t.status === 'inprogress').length;
    document.getElementById('count-done').innerText = state.tasks.filter(t => t.status === 'done').length;
}

function createTaskCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.draggable = true;
    div.innerHTML = `
        <div class="card-content">${task.text}</div>
        <div class="card-actions">
            <button class="btn-icon edit-btn" onclick="editTask('${task.id}')">✎</button>
            <button class="btn-icon delete-btn" onclick="deleteTask('${task.id}')">✕</button>
        </div>
    `;

    div.addEventListener('dragstart', (e) => {
        div.classList.add('dragging');
        e.dataTransfer.setData('text/plain', task.id);
    });

    div.addEventListener('dragend', () => div.classList.remove('dragging'));

    return div;
}
