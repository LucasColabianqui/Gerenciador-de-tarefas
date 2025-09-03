const express = require('express');
const router = express.Router();
const taskController = require('./controllers/taskController');

// ... (o restante do conteúdo do swagger e das rotas permanece o mesmo)

router.get('/', taskController.getTasks);
router.post('/', taskController.postTask);
router.patch('/:id/status', taskController.patchTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;