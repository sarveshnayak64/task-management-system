import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';
import Modal from './Modal';


const CommentItem = ({ comment, onReply, onDelete, currentUser }) => {
    const isOwner = currentUser && currentUser.id === comment.user_id;
    return (
        <div className="p-4 bg-gray-50 rounded-lg mb-3 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-blue-700">{comment.username}</span>
                <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleString()}
                </span>
            </div>
            <p className="text-gray-800 mb-3">{comment.content}</p>
            {comment.file_attachment_url && (
                <a
                    href={comment.file_attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm block mb-2"
                >
                    Attached File
                </a>
            )}
            <div className="flex gap-2">
                <button
                    onClick={() => onReply(comment.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                    Reply
                </button>
                {isOwner && (
                    <button
                        onClick={() => onDelete(comment.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ taskId }) => {
    const { token, user: currentUser } = useAuth();
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [newCommentAttachment, setNewCommentAttachment] = useState('');
    const [parentCommentId, setParentCommentId] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [commentToDeleteId, setCommentToDeleteId] = useState(null);
    const [message, setMessage] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const fetchComments = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await apiRequest(`/tasks/${taskId}/comments`, 'GET', null, token);
            setComments(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch comments.');
            console.error("Error fetching comments:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (taskId && token) {
            fetchComments();
        }
    }, [taskId, token]); 

    const handleAddComment = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (!newCommentContent.trim()) {
            setMessage('Comment content cannot be empty.');
            setIsMessageModalOpen(true);
            return;
        }

        try {
            await apiRequest(
                `/tasks/${taskId}/comments`,
                'POST',
                {
                    content: newCommentContent,
                    parent_comment_id: parentCommentId,
                    file_attachment_url: newCommentAttachment.trim() || null
                },
                token
            );
            setMessage('Comment added successfully!');
            setIsMessageModalOpen(true);
            setNewCommentContent('');
            setNewCommentAttachment('');
            setParentCommentId(null); 
            setIsReplyModalOpen(false); 
            fetchComments(); 
        } catch (err) {
            setError(err.message || 'Failed to add comment.');
            setMessage(err.message || 'Failed to add comment.');
            setIsMessageModalOpen(true);
            console.error("Error adding comment:", err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        setCommentToDeleteId(commentId);
        setIsConfirmDeleteModalOpen(true);
    };

    const confirmDeleteComment = async () => {
        setIsConfirmDeleteModalOpen(false);
        setError('');
        setMessage('');
        try {
            await apiRequest(`/comments/${commentToDeleteId}`, 'DELETE', null, token);
            setMessage('Comment deleted successfully!');
            setIsMessageModalOpen(true);
            fetchComments(); 
        } catch (err) {
            setError(err.message || 'Failed to delete comment.');
            setMessage(err.message || 'Failed to delete comment.');
            setIsMessageModalOpen(true);
            console.error("Error deleting comment:", err);
        } finally {
            setCommentToDeleteId(null);
        }
    };

    const openReplyModal = (parentId) => {
        setParentCommentId(parentId);
        setNewCommentContent(''); 
        setNewCommentAttachment(''); 
        setIsReplyModalOpen(true);
    };

    const closeReplyModal = () => {
        setIsReplyModalOpen(false);
        setParentCommentId(null); 
        setNewCommentContent('');
        setNewCommentAttachment('');
    };

    const closeMessageModal = () => {
        setIsMessageModalOpen(false);
        setMessage('');
    };

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Comments</h3>

            {/* Add New Comment Form */}
            <form onSubmit={handleAddComment} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-inner">
                <h4 className="text-xl font-semibold text-blue-800 mb-4">Add a new comment</h4>
                <div className="mb-4">
                    <label htmlFor="commentContent" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Comment
                    </label>
                    <textarea
                        id="commentContent"
                        rows="4"
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Type your comment here..."
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="commentAttachment" className="block text-sm font-medium text-gray-700 mb-1">
                        File Attachment URL (Optional)
                    </label>
                    <input
                        type="url"
                        id="commentAttachment"
                        value={newCommentAttachment}
                        onChange={(e) => setNewCommentAttachment(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="e.g., https://example.com/document.pdf"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Comment'}
                </button>
            </form>

            {/* Display Comments */}
            {isLoading && <p className="text-center text-blue-600">Loading comments...</p>}
            {error && <p className="text-center text-red-600">Error: {error}</p>}

            <div className="space-y-4">
                {comments.length === 0 && !isLoading && !error && (
                    <p className="text-center text-gray-600">No comments yet. Be the first to add one!</p>
                )}
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={openReplyModal}
                        onDelete={handleDeleteComment}
                        currentUser={currentUser}
                    />
                ))}
            </div>

            {/* Reply Modal */}
            <Modal isOpen={isReplyModalOpen} onClose={closeReplyModal} title={`Reply to Comment ${parentCommentId}`}>
                <form onSubmit={handleAddComment}>
                    <div className="mb-4">
                        <label htmlFor="replyContent" className="block text-sm font-medium text-gray-700 mb-1">
                            Your Reply
                        </label>
                        <textarea
                            id="replyContent"
                            rows="3"
                            value={newCommentContent}
                            onChange={(e) => setNewCommentContent(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Type your reply here..."
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="replyAttachment" className="block text-sm font-medium text-gray-700 mb-1">
                            File Attachment URL (Optional)
                        </label>
                        <input
                            type="url"
                            id="replyAttachment"
                            value={newCommentAttachment}
                            onChange={(e) => setNewCommentAttachment(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="e.g., https://example.com/document.pdf"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={closeReplyModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Submitting...' : 'Add Reply'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete Comment Modal */}
            <Modal isOpen={isConfirmDeleteModalOpen} onClose={() => setIsConfirmDeleteModalOpen(false)} title="Confirm Deletion">
                <p className="text-center text-lg mb-6">Are you sure you want to delete this comment?</p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setIsConfirmDeleteModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmDeleteComment}
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

export default CommentSection;
