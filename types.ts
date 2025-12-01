
export interface MilitaryAsset {
  id: string;
  name: string;
  origin: string;
  type: 'Tank' | 'Aircraft' | 'Ship' | 'Rifle' | 'Artillery' | 'Submarine';
  era: string;
  branch: 'Army' | 'Navy' | 'Air Force' | 'Marines';
  imageUrl: string;
  description: string;
  productionCost: string;
  upkeepCost: string;
  numberInService: string;
  specs: {
    [key: string]: string;
  };
}

export interface Filters {
  type: Set<string>;
  country: Set<string>;
  era: Set<string>;
  branch: Set<string>;
}