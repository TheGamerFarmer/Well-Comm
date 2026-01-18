"use client";

import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * Composant Modal avec blocage du défilement de l'arrière-plan
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    // Fige la page en fond lors de l'ouverture pour éviter le scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="flex justify-center items-center fixed inset-0 bg-black/50 z-10000 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white md:w-[55%] w-full rounded-xl p-8 relative shadow-2xl animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;