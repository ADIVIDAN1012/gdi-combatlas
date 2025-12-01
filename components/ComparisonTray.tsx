import React from 'react';
import type { MilitaryAsset } from '../types';
import { XIcon } from './icons';

interface ComparisonTrayProps {
    items: MilitaryAsset[];
    onRemove: (item: MilitaryAsset) => void;
    onClear: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({ items, onRemove, onClear }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md border-t border-cyan-500/30 z-40 shadow-lg shadow-cyan-900/20">
            <div className="container py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h3 className="text-lg font-bold text-cyan-400 hidden sm:block">COMPARE ASSETS</h3>
                        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[60vw] sm:max-w-none">
                            {items.map(item => (
                                <div key={item.id} className="flex-shrink-0 flex items-center gap-2 bg-gray-800 border border-cyan-500/30 rounded-full pl-3 pr-1 py-0.5">
                                    <span className="text-sm text-white whitespace-nowrap">{item.name}</span>
                                    <button onClick={() => onRemove(item)} className="p-1 rounded-full text-gray-400 hover:bg-red-500/50 hover:text-white transition-colors">
                                        <XIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                            {items.length < 2 && (
                                <div className="hidden md:block text-gray-500 text-sm whitespace-nowrap">Select {2-items.length} more to compare...</div>
                            )}
                        </div>
                    </div>

                    <button 
                        onClick={onClear}
                        className="text-gray-400 hover:text-red-400 text-sm font-semibold transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};
