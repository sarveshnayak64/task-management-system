import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';
import Modal from './Modal'; 

const ProjectList = ({ onSelectProject }) => {
    const { user, token, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [editingProjectName, setEditingProjectName] = useState('');
    const [editingProjectDescription, setEditingProjectDescription] = useState('');
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [projectToDeleteId, setProjectToDeleteId] = useState(null);
    const [message, setMessage] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const fetchProjects = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await apiRequest('/projects', 'GET', null, token);
            setProjects(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch projects.');
            console.error("Error fetching projects:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProjects();
        }
    }, [token]);

    const handleAddProject = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!newProjectName.trim()) {
            setMessage('Project name cannot be empty.');
            setIsMessageModalOpen(true);
            return;
        }
        try {
            await apiRequest('/projects', 'POST', { name: newProjectName, description: newProjectDescription }, token);
            setMessage('Project created successfully!');
            setIsMessageModalOpen(true);
            setShowAddProjectModal(false); 
            setNewProjectName(''); 
            setNewProjectDescription('');
            fetchProjects(); 
        } catch (err) {
            setError(err.message || 'Failed to add project.');
            setMessage(err.message || 'Failed to add project.');
            setIsMessageModalOpen(true);
            console.error("Error adding project:", err);
        }
    };

    const handleEditClick = (project) => {
        setEditingProjectId(project.id);
        setEditingProjectName(project.name);
        setEditingProjectDescription(project.description || '');
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!editingProjectName.trim()) {
            setMessage('Project name cannot be empty.');
            setIsMessageModalOpen(true);
            return;
        }
        try {
            await apiRequest(
                `/projects/${editingProjectId}`,
                'PUT',
                { name: editingProjectName, description: editingProjectDescription },
                token
            );
            setMessage('Project updated successfully!');
            setIsMessageModalOpen(true);
            setEditingProjectId(null); 
            fetchProjects(); 
        } catch (err) {
            setError(err.message || 'Failed to update project.');
            setMessage(err.message || 'Failed to update project.');
            setIsMessageModalOpen(true);
            console.error("Error updating project:", err);
        }
    };

    const handleDeleteProject = async (projectId) => {
        setProjectToDeleteId(projectId);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteProject = async () => {
        setIsConfirmDeleteModalOpen(false); 
        setError('');
        setMessage('');
        try {
            await apiRequest(`/projects/${projectToDeleteId}`, 'DELETE', null, token);
            setMessage('Project deleted successfully!');
            setIsMessageModalOpen(true);
            fetchProjects(); 
        } catch (err) {
            setError(err.message || 'Failed to delete project.');
            setMessage(err.message || 'Failed to delete project.');
            setIsMessageModalOpen(true);
            console.error("Error deleting project:", err);
        } finally {
            setProjectToDeleteId(null);
        }
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessage('');
    };

    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen rounded-lg shadow-xl">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-blue-800">Your Projects</h1>
                <div className="flex items-center gap-4">
                    <span className="text-lg text-gray-700 font-medium">Hello, {user?.username}!</span>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                    Create New Project
                </button>
            </div>

            {isLoading && <p className="text-center text-blue-600">Loading projects...</p>}
            {error && <p className="text-center text-red-600">Error: {error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 && !isLoading && !error ? (
                    <p className="col-span-full text-center text-gray-600 text-lg py-10">No projects yet. Create one to get started!</p>
                ) : (
                    projects.map(project => (
                        <div key={project.id} className="bg-white p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                            <p className="text-gray-700 text-sm mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 justify-end mt-4 border-t pt-4">
                                <button
                                    onClick={() => onSelectProject(project)}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                >
                                    View Details
                                </button>
                                <button
                                    onClick={() => handleEditClick(project)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(project.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Project Modal */}
            <Modal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)} title="Create New Project">
                <form onSubmit={handleAddProject} className="space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            id="projectName"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            id="projectDescription"
                            rows="3"
                            value={newProjectDescription}
                            onChange={(e) => setNewProjectDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowAddProjectModal(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Add Project
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Project Modal */}
            <Modal isOpen={editingProjectId !== null} onClose={() => setEditingProjectId(null)} title="Edit Project">
                <form onSubmit={handleUpdateProject} className="space-y-4">
                    <div>
                        <label htmlFor="editProjectName" className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                        <input
                            type="text"
                            id="editProjectName"
                            value={editingProjectName}
                            onChange={(e) => setEditingProjectName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editProjectDescription" className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            id="editProjectDescription"
                            rows="3"
                            value={editingProjectDescription}
                            onChange={(e) => setEditingProjectDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setEditingProjectId(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Project Modal */}
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} title="Confirm Deletion">
                <p className="text-center text-lg mb-6">Are you sure you want to delete this project? All associated tasks and comments will also be deleted.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsConfirmDeleteModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteProject}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Delete
                    </button>
                </div>
            </Modal>

            {/* General Message Modal */}
            <Modal isOpen={isMessageModalOpen} onClose={closeMessageModal} title="Notification">
                <p className="text-center text-lg">{message}</p>
                <div className="mt-6 text-center">
                    <button
                        onClick={closeMessageModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default ProjectList;
