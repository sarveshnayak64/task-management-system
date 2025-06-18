const express = require('express');
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../server');

const router = express.Router();

router.get('/tasks/:taskId/comments', authenticateToken, commentController.getComments);

router.post('/tasks/:taskId/comments', authenticateToken, commentController.addComment);

router.put('/comments/:id', authenticateToken, commentController.updateComment);

router.delete('/comments/:id', authenticateToken, commentController.deleteComment);

module.exports = router;
