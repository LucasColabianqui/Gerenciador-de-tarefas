const Task = require('./models/Task');

// In-memory data store
let tasks = [
    new Task(1, 'Implementar Backend', 'Criar a API RESTful para o gerenciador de tarefas', 'em andamento'),
    new Task(2, 'Implementar Frontend', 'Criar a interface com React', 'pendente'),
    new Task(3, 'Documentar API', 'Usar Swagger para documentar os endpoints', 'pendente'),
];
let nextTaskId = 4;

const listTasks = (status) => {
    if (status) {
        return tasks.filter(task => task.status === status);
    }
    return tasks;
};

const createTask = (title, description) => {
    const newTask = new Task(nextTaskId++, title, description);
    tasks.push(newTask);
    return newTask;
};

const updateTaskStatus = (id, status) => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.status = status;
        return task;
    }
    return null;
};

const removeTask = (id) => {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        tasks.splice(index, 1);
        return true;
    }
    return false;
};

module.exports = {
    listTasks,
    createTask,
    updateTaskStatus,
    removeTask,
};