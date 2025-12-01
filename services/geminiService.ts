import type { MilitaryAsset } from '../types';
import { MOCK_ASSETS } from './mockData';

const fetchMilitaryAssets = async (): Promise<MilitaryAsset[]> => {
    // Return mock data directly to simulate a local-only dataset,
    // removing the dependency on any external API or database.
    return Promise.resolve(MOCK_ASSETS);
};

export { fetchMilitaryAssets };