const express = require('express');
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../server'); 

const router = express.Router();

router.get('/projects', authenticateToken, projectController.getProjects);

router.post('/projects', authenticateToken, projectController.createProject);

router.put('/projects/:id', authenticateToken, projectController.updateProject);

router.delete('/projects/:id', authenticateToken, projectController.deleteProject);

module.exports = router;