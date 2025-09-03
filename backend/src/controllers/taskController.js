const taskService = require('../services/taskService');

const getTasks = (req, res) => {
    const { status } = req.query;
    const tasks = taskService.listTasks(status);
    res.json(tasks);
};

const postTask = (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'O título é obrigatório.' });
    }
    const newTask = taskService.createTask(title, description);
    res.status(201).json(newTask);
};

const patchTaskStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'O status é obrigatório.' });
    }
    const updatedTask = taskService.updateTaskStatus(id, status);
    if (updatedTask) {
        res.json(updatedTask);
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
};

const deleteTask = (req, res) => {
    const { id } = req.params;
    const success = taskService.removeTask(id);
    if (success) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
};

module.exports = {
    getTasks,
    postTask,
    patchTaskStatus,
    deleteTask,
};
