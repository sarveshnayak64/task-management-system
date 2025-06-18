const projectModel = require('../models/projectModel');

exports.getProjects = async (req, res) => {
    try {
        const projects = await projectModel.findByUserId(req.user.id);
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error.message);
        res.status(500).json({ message: 'Server error fetching projects.' });
    }
};

exports.createProject = async (req, res) => {
    const { name, description } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Project name is required.' });
    }
    try {
        const projectId = await projectModel.create(req.user.id, name, description);
        res.status(201).json({ message: 'Project created successfully!', projectId });
    } catch (error) {
        console.error('Error creating project:', error.message);
        res.status(500).json({ message: 'Server error creating project.' });
    }
};

exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Project name is required.' });
    }

    try {
        const project = await projectModel.findByIdAndUserId(id, req.user.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have permission to update it.' });
        }

        const affectedRows = await projectModel.update(id, name, description);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found or no changes were made.' });
        }
        res.status(200).json({ message: 'Project updated successfully!' });
    } catch (error) {
        console.error('Error updating project:', error.message);
        res.status(500).json({ message: 'Server error updating project.' });
    }
};

exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await projectModel.findByIdAndUserId(id, req.user.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have permission to delete it.' });
        }

        const affectedRows = await projectModel.remove(id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Project not found or no changes were made.' });
        }
        res.status(200).json({ message: 'Project deleted successfully!' });
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ message: 'Server error deleting project.' });
    }
};
