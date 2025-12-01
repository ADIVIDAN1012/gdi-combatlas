import React, { useMemo } from 'react';
import type { MilitaryAsset } from '../types';
import { GlobeIcon } from './icons';

interface CountrySummaryProps {
    assets: MilitaryAsset[];
}

export const CountrySummary: React.FC<CountrySummaryProps> = ({ assets }) => {
    const summary = useMemo(() => {
        const countryCounts = assets.reduce((acc, asset) => {
            acc[asset.origin] = (acc[asset.origin] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Fix: Explicitly cast values to number for sorting, as type inference can be unreliable.
        return Object.entries(countryCounts).sort((a, b) => (b[1] as number) - (a[1] as number));
    }, [assets]);

    if (summary.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-4 mb-6">
            <h3 className="flex items-center text-md font-bold text-cyan-400 tracking-wider mb-3">
                <GlobeIcon className="w-5 h-5 mr-2" />
                Asset Distribution by Country
            </h3>
            <div className="flex flex-wrap gap-3">
                {summary.map(([country, count]) => (
                    <div key={country} className="flex items-center bg-gray-700/60 rounded-full px-3 py-1 text-sm">
                        <span className="font-semibold text-gray-300 mr-2">{country}</span>
                        <span className="font-mono bg-cyan-500/80 text-gray-900 font-bold rounded-full h-5 w-5 flex items-center justify-center text-xs">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
