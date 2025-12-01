import React from 'react';
import type { MilitaryAsset } from '../types';
import { TargetIcon } from './icons';

interface AssetCardProps {
    asset: MilitaryAsset;
    onCompareToggle: (asset: MilitaryAsset) => void;
    isInCompare: boolean;
    isCompareDisabled: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onCompareToggle, isInCompare, isCompareDisabled }) => {
    const displaySpecs = {
        'In Service': asset.numberInService,
        'Prod. Cost': asset.productionCost,
        ...asset.specs,
    };

    return (
        <div className="group relative bg-gray-800/50 border border-cyan-500/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-cyan-500/20 hover:shadow-lg hover:border-cyan-500/50 h-100 d-flex flex-column">
             <div className="absolute inset-0 bg-grid-cyan-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-30 transform-gpu translate-x-full group-hover:translate-x-0 transition-all duration-500 ease-out"></div>


            <div className="relative">
                <img src={asset.imageUrl} alt={asset.name} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-xl font-bold text-white tracking-wider">{asset.name}</h3>
                    <p className="text-sm text-cyan-400">{asset.origin} / {asset.era}</p>
                </div>
            </div>

            <div className="p-4 relative d-flex flex-column flex-grow-1">
                <p className="text-gray-400 text-sm h-20 overflow-hidden">{asset.description}</p>
                
                <div className="mt-4 border-t border-cyan-500/20 pt-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(displaySpecs).slice(0, 4).map(([key, value]) => (
                            <div key={key}>
                                <span className="text-cyan-400/80">{key}: </span>
                                <span className="text-gray-300">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto pt-4">
                    <button 
                        onClick={() => onCompareToggle(asset)}
                        disabled={isCompareDisabled}
                        className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                            isInCompare 
                                ? 'bg-red-500/80 hover:bg-red-500 text-white'
                                : isCompareDisabled
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-cyan-600/80 hover:bg-cyan-600 text-white'
                        }`}
                    >
                        <TargetIcon className="w-4 h-4" />
                        {isInCompare ? 'Remove from Compare' : 'Add to Compare'}
                    </button>
                </div>
            </div>
        </div>
    );
};
