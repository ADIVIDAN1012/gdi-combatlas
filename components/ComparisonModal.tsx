
import React from 'react';
import type { MilitaryAsset } from '../types';

interface ComparisonModalProps {
    assets: MilitaryAsset[];
    onClose: () => void;
}

const AssetDetailColumn: React.FC<{ asset: MilitaryAsset }> = ({ asset }) => (
    <div className="w-full md:w-1/2 p-4">
        <img src={asset.imageUrl} alt={asset.name} className="w-full h-64 object-cover rounded-lg border-2 border-cyan-500/30" />
        <h3 className="text-2xl font-bold text-cyan-400 mt-4">{asset.name}</h3>
        <p className="text-md text-gray-400">{asset.origin} / {asset.era}</p>
        <p className="mt-4 text-sm text-gray-300">{asset.description}</p>
        <div className="mt-6 border-t border-cyan-500/20 pt-4">
            <h4 className="text-lg font-semibold text-cyan-300 mb-2">Specifications</h4>
            <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                    <span className="text-gray-400">Production Cost</span>
                    <span className="text-white font-mono text-right">{asset.productionCost}</span>
                </li>
                <li className="flex justify-between">
                    <span className="text-gray-400">Upkeep Cost</span>
                    <span className="text-white font-mono text-right">{asset.upkeepCost}</span>
                </li>
                 <li className="flex justify-between">
                    <span className="text-gray-400">Number in Service</span>
                    <span className="text-white font-mono text-right">{asset.numberInService}</span>
                </li>
                {Object.entries(asset.specs).map(([key, value]) => (
                    <li key={key} className="flex justify-between">
                        <span className="text-gray-400">{key}</span>
                        <span className="text-white font-mono text-right">{value}</span>
                    </li>
                ))}
                 <li className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white font-mono text-right">{asset.type}</span>
                </li>
                 <li className="flex justify-between">
                    <span className="text-gray-400">Branch</span>
                    <span className="text-white font-mono text-right">{asset.branch}</span>
                </li>
            </ul>
        </div>
    </div>
);

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ assets, onClose }) => {
    if (assets.length !== 2) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-900 border-2 border-cyan-500/50 rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-900/30" onClick={e => e.stopPropagation()}>
                <div className="p-6 relative">
                    <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">Asset Comparison</h2>
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-cyan-500/20">
                        <AssetDetailColumn asset={assets[0]} />
                        <AssetDetailColumn asset={assets[1]} />
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-6">Click outside to close</p>
                </div>
            </div>
        </div>
    );
};