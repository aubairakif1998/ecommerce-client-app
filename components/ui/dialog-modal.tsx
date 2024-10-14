import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, description }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-2">{description}</p>
                <button onClick={onClose} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
                    Close
                </button>
            </div>
        </div>
    );
};
