import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AssetCard } from './components/AssetCard';
import { ComparisonModal } from './components/ComparisonModal';
import { ComparisonTray } from './components/ComparisonTray';
import { Footer } from './components/Footer';
import { AboutModal } from './components/AboutModal';
import { Chatbot } from './components/Chatbot';
import { LoginScreen } from './components/LoginScreen';
import type { MilitaryAsset, Filters } from './types';
import { fetchAllAssets } from './services/realData';
import { LoaderIcon, SearchIcon, ChatIcon } from './components/icons';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [assets, setAssets] = useState<MilitaryAsset[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
    const [isChatbotOpen, setChatbotOpen] = useState<boolean>(false);
    
    const [filters, setFilters] = useState<Filters>({
        type: new Set(),
        country: new Set(),
        era: new Set(),
        branch: new Set(),
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [comparisonList, setComparisonList] = useState<MilitaryAsset[]>([]);

    useEffect(() => {
        if (isAuthenticated) {
            const loadAssets = async () => {
                setIsLoading(true);
                try {
                    const fetchedAssets = await fetchAllAssets();
                    setAssets(fetchedAssets);
                } catch (error) {
                    console.error("Failed to load assets", error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadAssets();
        }
    }, [isAuthenticated]);

    const filterOptions = useMemo(() => {
        const types = new Set<string>();
        const countries = new Set<string>();
        const eras = new Set<string>();
        const branches = new Set<string>();
        const typesByBranch: Record<string, Set<string>> = {};

        assets.forEach(asset => {
            types.add(asset.type);
            countries.add(asset.origin);
            eras.add(asset.era);
            branches.add(asset.branch);

            if (!typesByBranch[asset.branch]) {
                typesByBranch[asset.branch] = new Set();
            }
            typesByBranch[asset.branch].add(asset.type);
        });

        return {
            type: Array.from(types).sort(),
            country: Array.from(countries).sort(),
            era: Array.from(eras).sort(),
            branch: Array.from(branches).sort(),
            typesByBranch: Object.fromEntries(
                Object.entries(typesByBranch).map(([k, v]) => [k, Array.from(v).sort()])
            )
        };
    }, [assets]);
    
    const filteredAssets = useMemo(() => {
        return assets
            .filter(asset => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    asset.name.toLowerCase().includes(searchLower) ||
                    asset.origin.toLowerCase().includes(searchLower) ||
                    asset.era.toLowerCase().includes(searchLower)
                );
            })
            .filter(asset => {
                return (
                    (filters.type.size === 0 || filters.type.has(asset.type)) &&
                    (filters.country.size === 0 || filters.country.has(asset.origin)) &&
                    (filters.era.size === 0 || filters.era.has(asset.era)) &&
                    (filters.branch.size === 0 || filters.branch.has(asset.branch))
                );
            });
    }, [assets, searchTerm, filters]);

    const handleFilterChange = useCallback((category: keyof Filters, value: string) => {
        setFilters(prev => {
            const newSet = new Set(prev[category]);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return { ...prev, [category]: newSet };
        });
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({
            type: new Set(),
            country: new Set(),
            era: new Set(),
            branch: new Set(),
        });
    }, []);

    const handleToggleCompare = useCallback((asset: MilitaryAsset) => {
        setComparisonList(prev => {
            const isInList = prev.some(item => item.id === asset.id);
            if (isInList) {
                return prev.filter(item => item.id !== asset.id);
            }
            if (prev.length < 2) {
                return [...prev, asset];
            }
            return prev; // Max 2 items
        });
    }, []);

    if (!isAuthenticated) {
        return <LoginScreen onLogin={() => {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
        }} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 bg-grid-cyan-500/[0.05] flex flex-col">
            <Header onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
            <div className="flex flex-1">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setSidebarOpen(false)}
                    filters={filters}
                    filterOptions={filterOptions}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                <main className="flex-1 p-4 md:p-8 transition-all duration-300 lg:ml-64">
                    <div className="mb-6 relative">
                        <input
                            type="text"
                            placeholder="Search Indian defense assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-800/50 border-2 border-cyan-500/30 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                            aria-label="Search assets"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-cyan-400/70" />
                        </div>
                    </div>

                    {/* CountrySummary removed as app is now single-nation */}

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-cyan-400">
                           <LoaderIcon className="w-16 h-16 animate-spin" />
                            <p className="mt-4 text-xl tracking-widest">ACCESSING DATABASE...</p>
                        </div>
                    ) : (
                        <div className="row g-4 mt-3">
                            {filteredAssets.map(asset => (
                                <div key={asset.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-3 d-flex align-items-stretch">
                                    <AssetCard 
                                        key={asset.id} 
                                        asset={asset} 
                                        onCompareToggle={handleToggleCompare}
                                        isInCompare={comparisonList.some(item => item.id === asset.id)}
                                        isCompareDisabled={!comparisonList.some(item => item.id === asset.id) && comparisonList.length >= 2}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
            {comparisonList.length > 0 && (
                <ComparisonTray 
                    items={comparisonList} 
                    onRemove={handleToggleCompare}
                    onClear={() => setComparisonList([])}
                />
            )}
            {comparisonList.length === 2 && (
                <ComparisonModal 
                    assets={comparisonList} 
                    onClose={() => setComparisonList([])}
                />
            )}
            <Footer onAboutClick={() => setAboutModalOpen(true)} />
            {isAboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}
            
            {!isChatbotOpen && (
                 <div className="fixed bottom-6 right-6 z-40">
                    <button 
                        onClick={() => setChatbotOpen(true)}
                        className="h-16 w-16 bg-cyan-500 rounded-full text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all duration-300 transform hover:scale-110 animate-pulse"
                        aria-label="Toggle AI Chat"
                    >
                        <ChatIcon className="w-8 h-8" />
                    </button>
                </div>
            )}
           
            {isChatbotOpen && <Chatbot onClose={() => setChatbotOpen(false)} />}
        </div>
    );
};

export default App;