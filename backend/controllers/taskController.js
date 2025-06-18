
const taskModel = require('../models/taskModel');
const projectModel = require('../models/projectModel');

exports.getTasks = async (req, res) => {
    const { projectId } = req.params;
    try {
        const project = await projectModel.findByIdAndUserId(projectId, req.user.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have access to it.' });
        }

        const tasks = await taskModel.findByProjectId(projectId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error.message);
        res.status(500).json({ message: 'Server error fetching tasks.' });
    }
};

exports.createTask = async (req, res) => {
    const { projectId } = req.params;
    const { title, description, priority, deadline, status, file_attachment_url } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Task title is required.' });
    }

    try {
        const project = await projectModel.findByIdAndUserId(projectId, req.user.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have access to create tasks in it.' });
        }

        const taskId = await taskModel.create(projectId, title, description, priority, deadline, status, file_attachment_url);
        res.status(201).json({ message: 'Task created successfully!', taskId });
    } catch (error) {
        console.error('Error creating task:', error.message);
        res.status(500).json({ message: 'Server error creating task.' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, deadline, status, file_attachment_url } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Task title is required.' });
    }

    try {
        const taskOwner = await taskModel.findOwnerByTaskId(id);
        if (!taskOwner || taskOwner.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to update it.' });
        }

        const affectedRows = await taskModel.update(id, title, description, priority, deadline, status, file_attachment_url);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or no changes were made.' });
        }
        res.status(200).json({ message: 'Task updated successfully!' });
    } catch (error) {
        console.error('Error updating task:', error.message);
        res.status(500).json({ message: 'Server error updating task.' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const taskOwner = await taskModel.findOwnerByTaskId(id);
        if (!taskOwner || taskOwner.user_id !== req.user.id) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it.' });
        }

        const affectedRows = await taskModel.remove(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found or no changes were made.' });
        }
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error) {
        console.error('Error deleting task:', error.message);
        res.status(500).json({ message: 'Server error deleting task.' });
    }
};
