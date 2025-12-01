import React, { useState } from 'react';
import type { Filters } from '../types';
import { ChevronDownIcon, FilterIcon, XIcon } from './icons';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    filters: Filters;
    filterOptions: {
        type: string[];
        country: string[];
        era: string[];
        branch: string[];
        typesByBranch: Record<string, string[]>;
    };
    onFilterChange: (category: keyof Filters, value: string) => void;
    onClearFilters: () => void;
}

const FilterSection: React.FC<{ title: string; children: React.ReactNode; defaultExpanded?: boolean }> = ({ title, children, defaultExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div className="py-4 border-b border-cyan-500/20">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center text-left">
                <h3 className="font-semibold text-cyan-300">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-cyan-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            {isExpanded && <div className="mt-3 space-y-2">{children}</div>}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, filters, filterOptions, onFilterChange, onClearFilters }) => {
    const renderFilterOptions = (category: keyof Filters, options: string[]) => {
        return options.map(option => (
            <div key={option} className="flex items-center">
                <input
                    id={`${category}-${option}`}
                    type="checkbox"
                    checked={filters[category].has(option)}
                    onChange={() => onFilterChange(category, option)}
                    className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-600 cursor-pointer"
                />
                <label htmlFor={`${category}-${option}`} className="ml-3 text-sm text-gray-300 cursor-pointer">{option}</label>
            </div>
        ));
    };

    // Fix: Cast the value from Object.values to a Set to access the 'size' property, as TypeScript infers it as 'unknown'.
    const hasActiveFilters = Object.values(filters).some(set => (set as Set<string>).size > 0);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
                <div className="flex items-center">
                    <FilterIcon className="w-6 h-6 text-cyan-400"/>
                    <h2 className="ml-2 text-lg font-bold text-cyan-400">FILTERS</h2>
                </div>
                <button onClick={onClose} className="lg:hidden p-1 rounded-full text-gray-400 hover:bg-gray-700">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4">
                <FilterSection title="Type">
                    {Object.entries(filterOptions.typesByBranch).map(([branch, types]) => (
                        <div key={branch} className="mb-3 pl-2">
                            <h4 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-2">{branch}</h4>
                            <div className="space-y-1 pl-2 border-l border-cyan-500/10">
                                {renderFilterOptions('type', types)}
                            </div>
                        </div>
                    ))}
                </FilterSection>
                {/* Country filter removed for India-specific version */}
                <FilterSection title="Era">{renderFilterOptions('era', filterOptions.era)}</FilterSection>
                <FilterSection title="Branch">{renderFilterOptions('branch', filterOptions.branch)}</FilterSection>
            </div>
            <div className="p-4 border-t border-cyan-500/30">
                {hasActiveFilters && (
                     <button 
                        onClick={onClearFilters}
                        className="w-full bg-cyan-600/30 border border-cyan-500 text-cyan-300 hover:bg-cyan-500/50 rounded-md py-2 transition-colors font-semibold"
                     >
                        Clear All Filters
                     </button>
                )}
            </div>
        </div>
    );


    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900/90 backdrop-blur-sm border-r border-cyan-500/30 z-40 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {sidebarContent}
            </aside>
        </>
    );
};