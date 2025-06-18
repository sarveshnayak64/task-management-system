import React from 'react';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
                className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all sm:my-8 sm:w-full ${className}`}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body max-h-96 overflow-y-auto pr-2"> 
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
