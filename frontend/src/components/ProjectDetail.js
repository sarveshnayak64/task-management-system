import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';
import TaskItem from './TaskItem';
import CommentSection from './CommentSection';
import Modal from './Modal'; 

const ProjectDetail = ({ project, onBack }) => {
    const { token, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState('Medium');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('to-do');
    const [newTaskAttachment, setNewTaskAttachment] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState(null); 
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [taskToDeleteId, setTaskToDeleteId] = useState(null);
    const [message, setMessage] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);


    const fetchTasks = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await apiRequest(`/projects/${project.id}/tasks`, 'GET', null, token);
            setTasks(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch tasks.');
            console.error("Error fetching tasks:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (project && token) {
            fetchTasks();
            setSelectedTaskId(null); 
        }
    }, [project, token]); 

    const handleAddTask = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!newTaskTitle.trim()) {
            setMessage('Task title cannot be empty.');
            setIsMessageModalOpen(true);
            return;
        }
        try {
            await apiRequest(
                `/projects/${project.id}/tasks`,
                'POST',
                {
                    title: newTaskTitle,
                    description: newTaskDescription,
                    priority: newTaskPriority,
                    deadline: newTaskDeadline || null,
                    status: newTaskStatus,
                    file_attachment_url: newTaskAttachment.trim() || null
                },
                token
            );
            setMessage('Task created successfully!');
            setIsMessageModalOpen(true);
            setShowAddTaskModal(false); 
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskPriority('Medium');
            setNewTaskDeadline('');
            setNewTaskStatus('to-do');
            setNewTaskAttachment('');
            fetchTasks(); 
        } catch (err) {
            setError(err.message || 'Failed to add task.');
            setMessage(err.message || 'Failed to add task.');
            setIsMessageModalOpen(true);
            console.error("Error adding task:", err);
        }
    };

    const handleUpdateTask = async (taskId, updatedFields) => {
        setError('');
        setMessage('');
        try {
            await apiRequest(`/tasks/${taskId}`, 'PUT', updatedFields, token);
            setMessage('Task updated successfully!');
            setIsMessageModalOpen(true);
            fetchTasks(); 
        } catch (err) {
            setError(err.message || 'Failed to update task.');
            setMessage(err.message || 'Failed to update task.');
            setIsMessageModalOpen(true);
            console.error("Error updating task:", err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        setTaskToDeleteId(taskId);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteTask = async () => {
        setIsConfirmDeleteModalOpen(false);
        setError('');
        setMessage('');
        try {
            await apiRequest(`/tasks/${taskToDeleteId}`, 'DELETE', null, token);
            setMessage('Task deleted successfully!');
            setIsMessageModalOpen(true);
            fetchTasks(); 
            if (selectedTaskId === taskToDeleteId) {
                setSelectedTaskId(null); 
            }
        } catch (err) {
            setError(err.message || 'Failed to delete task.');
            setMessage(err.message || 'Failed to delete task.');
            setIsMessageModalOpen(true);
            console.error("Error deleting task:", err);
        } finally {
            setTaskToDeleteId(null);
        }
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessage('');
    };


    return (
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen rounded-lg shadow-xl">
            <header className="flex justify-between items-center mb-8 border-b pb-4">
                <button
                    onClick={onBack}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Back to Projects
                </button>
                <h2 className="text-3xl font-extrabold text-blue-800">{project.name}</h2>
                <span className="text-lg text-gray-600">Created by: {user.username}</span>
            </header>

            <p className="text-lg text-gray-700 mb-8 p-4 bg-white rounded-lg shadow-sm border border-blue-200">{project.description}</p>

            {/* Task List Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Tasks</h3>
                    <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                    >
                        Add New Task
                    </button>
                </div>

                {isLoading && <p className="text-center text-blue-600">Loading tasks...</p>}
                {error && <p className="text-center text-red-600">Error: {error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length === 0 && !isLoading && !error ? (
                        <p className="col-span-full text-center text-gray-600">No tasks yet. Add one to get started!</p>
                    ) : (
                        tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                                onSelect={setSelectedTaskId}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Comment Section */}
            {selectedTaskId && (
                <div className="mt-10">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                        Comments for Task: <span className="text-blue-700">{tasks.find(t => t.id === selectedTaskId)?.title}</span>
                    </h3>
                    <CommentSection taskId={selectedTaskId} />
                </div>
            )}

            {/* Add Task Modal */}
            <Modal isOpen={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} title="Add New Task">
                <form onSubmit={handleAddTask} className="space-y-4">
                    <div>
                        <label htmlFor="newTaskTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            id="newTaskTitle"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="newTaskDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="newTaskDescription"
                            rows="3"
                            value={newTaskDescription}
                            onChange={(e) => setNewTaskDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="newTaskPriority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            id="newTaskPriority"
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="newTaskDeadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="date"
                            id="newTaskDeadline"
                            value={newTaskDeadline}
                            onChange={(e) => setNewTaskDeadline(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="newTaskStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="newTaskStatus"
                            value={newTaskStatus}
                            onChange={(e) => setNewTaskStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="to-do">To-Do</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="newTaskAttachment" className="block text-sm font-medium text-gray-700 mb-1">File Attachment URL</label>
                        <input
                            type="url"
                            id="newTaskAttachment"
                            value={newTaskAttachment}
                            onChange={(e) => setNewTaskAttachment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="e.g., https://example.com/document.pdf"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowAddTaskModal(false)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Add Task
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Task Modal */}
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} title="Confirm Deletion">
                <p className="text-center text-lg mb-6">Are you sure you want to delete this task? All associated comments will also be deleted.</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsConfirmDeleteModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteTask}
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

export default ProjectDetail;
