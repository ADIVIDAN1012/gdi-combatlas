import React from 'react';
import { CombatlasLogoIcon, MenuIcon } from './icons';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-30 bg-gray-900/70 backdrop-blur-md border-b border-cyan-500/30 shadow-lg shadow-cyan-900/10">
            <div className="container">
                <div className="flex items-center justify-between h-16 lg:pl-64">
                    <div className="flex items-center">
                        <CombatlasLogoIcon className="h-8 w-8 text-cyan-400 animate-pulse" />
                        <h1 className="ml-3 text-2xl font-bold text-cyan-400 tracking-widest">
                            COMBATLAS
                        </h1>
                    </div>
                    <div className="lg:hidden">
                        <button onClick={onMenuClick} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};