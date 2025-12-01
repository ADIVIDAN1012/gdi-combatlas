import React from 'react';

interface FooterProps {
    onAboutClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAboutClick }) => {
    return (
        <footer className="w-full py-4 mt-auto">
            <div className="text-center text-sm text-gray-600 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
                <span>&copy; 2025 Global Defense Index (GDI). All Rights Reserved.</span>
                <span className="hidden md:inline text-gray-700">|</span>
                <button onClick={onAboutClick} className="hover:text-cyan-400 transition-colors">
                    About
                </button>
            </div>
        </footer>
    );
};