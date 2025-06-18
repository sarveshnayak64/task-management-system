const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../server'); 

const router = express.Router();

router.get('/projects/:projectId/tasks', authenticateToken, taskController.getTasks);

router.post('/projects/:projectId/tasks', authenticateToken, taskController.createTask);

router.put('/tasks/:id', authenticateToken, taskController.updateTask);

router.delete('/tasks/:id', authenticateToken, taskController.deleteTask);

module.exports = router;
