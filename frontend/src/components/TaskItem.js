import React, { useState } from 'react';
import Modal from './Modal';

const TaskItem = ({ task, onUpdate, onDelete, onSelect }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || '');
    const [editedPriority, setEditedPriority] = useState(task.priority);
    const [editedDeadline, setEditedDeadline] = useState(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    const [editedStatus, setEditedStatus] = useState(task.status);
    const [editedAttachment, setEditedAttachment] = useState(task.file_attachment_url || '');

    const handleSave = () => {
        onUpdate(task.id, {
            title: editedTitle,
            description: editedDescription,
            priority: editedPriority,
            deadline: editedDeadline || null, 
            status: editedStatus,
            file_attachment_url: editedAttachment || null
        });
        setIsEditing(false);
    };

    const priorityColors = {
        'Low': 'bg-green-100 text-green-800',
        'Medium': 'bg-yellow-100 text-yellow-800',
        'High': 'bg-red-100 text-red-800',
    };

    const statusColors = {
        'to-do': 'bg-gray-200 text-gray-800',
        'in-progress': 'bg-blue-200 text-blue-800',
        'done': 'bg-purple-200 text-purple-800',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-4">
            <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-bold text-gray-800">{task.title}</h4>
                <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                        {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                        {task.status}
                    </span>
                </div>
            </div>
            <p className="text-gray-700 mb-3">{task.description}</p>
            {task.deadline && (
                <p className="text-sm text-gray-600 mb-3">
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                </p>
            )}
            {task.file_attachment_url && (
                <a
                    href={task.file_attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block mb-3"
                >
                    Attached File
                </a>
            )}

            <div className="flex gap-3 justify-end mt-4 border-t pt-4">
                <button
                    onClick={() => onSelect(task.id)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    View Comments
                </button>
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    Delete
                </button>
            </div>

            {/* Edit Task Modal */}
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Task">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            id="editTitle"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            id="editDescription"
                            rows="3"
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="editPriority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                            id="editPriority"
                            value={editedPriority}
                            onChange={(e) => setEditedPriority(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="editDeadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="date"
                            id="editDeadline"
                            value={editedDeadline}
                            onChange={(e) => setEditedDeadline(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            id="editStatus"
                            value={editedStatus}
                            onChange={(e) => setEditedStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        >
                            <option value="to-do">To-Do</option>
                            <option value="in-progress">In-Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="editAttachment" className="block text-sm font-medium text-gray-700 mb-1">File Attachment URL</label>
                        <input
                            type="url"
                            id="editAttachment"
                            value={editedAttachment}
                            onChange={(e) => setEditedAttachment(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="e.g., https://example.com/document.pdf"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
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
        </div>
    );
};

export default TaskItem;
