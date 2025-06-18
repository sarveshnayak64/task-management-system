const commentModel = require('../models/commentModel');
const taskModel = require('../models/taskModel');

exports.getComments = async (req, res) => {
    const { taskId } = req.params;
    try {
        const taskOwner = await taskModel.findOwnerByTaskId(taskId);
        if (!taskOwner || taskOwner.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or you do not have access to its comments.' });
        }

        const comments = await commentModel.findByTaskId(taskId);

        const buildNestedComments = (commentList, parentId = null) => {
            const nested = [];
            commentList.forEach(comment => {
                if (comment.parent_comment_id === parentId) {
                    const children = buildNestedComments(commentList, comment.id);
                    if (children.length) {
                        comment.replies = children;
                    }
                    nested.push(comment);
                }
            });
            return nested;
        };

        const nestedComments = buildNestedComments(comments);
        res.status(200).json(nestedComments);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ message: 'Server error fetching comments.' });
    }
};

exports.addComment = async (req, res) => {
    const { taskId } = req.params;
    const { content, parent_comment_id, file_attachment_url } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required.' });
    }

    try {
        const taskOwner = await taskModel.findOwnerByTaskId(taskId);
        if (!taskOwner || taskOwner.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or you do not have access to add comments to it.' });
        }

        const commentId = await commentModel.create(taskId, req.user.id, content, parent_comment_id, file_attachment_url);
        res.status(201).json({ message: 'Comment added successfully!', commentId });
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({ message: 'Server error adding comment.' });
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { content, file_attachment_url } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required.' });
    }

    try {
        const affectedRows = await commentModel.update(id, req.user.id, content, file_attachment_url);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to update it.' });
        }
        res.status(200).json({ message: 'Comment updated successfully!' });
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).json({ message: 'Server error updating comment.' });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await commentModel.remove(id, req.user.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it.' });
        }
        res.status(200).json({ message: 'Comment deleted successfully!' });
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ message: 'Server error deleting comment.' });
    }
};
