import { MilitaryAsset } from '../types';

const WIKI_API_BASE = 'https://en.wikipedia.org/w/api.php';

interface WikiResponse {
    parse: {
        text: {
            '*': string;
        };
        title: string;
    };
}

const fetchWikiPage = async (page: string): Promise<string> => {
    const params = new URLSearchParams({
        action: 'parse',
        page: page,
        format: 'json',
        origin: '*', // Enable CORS
        prop: 'text',
        redirects: '1'
    });

    try {
        const response = await fetch(`${WIKI_API_BASE}?${params.toString()}`);
        const data: WikiResponse = await response.json();
        return data.parse.text['*'];
    } catch (error) {
        console.error(`Error fetching ${page}:`, error);
        return '';
    }
};

const cleanText = (text: string | null | undefined): string => {
    if (!text) return '';
    return text.replace(/\[.*?\]/g, '').trim(); // Remove citations like [1]
};

const parseArmyData = (html: string): MilitaryAsset[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const assets: MilitaryAsset[] = [];
    const tables = doc.querySelectorAll('table.wikitable');

    tables.forEach((table) => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim().toLowerCase() || '');
        
        let nameIdx = -1, originIdx = -1, typeIdx = -1, quantityIdx = -1;

        headers.forEach((h, i) => {
            if (h.includes('model') || h.includes('name') || h.includes('weapon') || h.includes('vehicle')) nameIdx = i;
            else if (h.includes('origin')) originIdx = i;
            else if (h.includes('type')) typeIdx = i;
            else if (h.includes('quantity') || h.includes('number') || h.includes('active')) quantityIdx = i;
        });

        if (nameIdx === -1) return;

        const rows = table.querySelectorAll('tr');
        // Skip header
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.querySelectorAll('td, th');
            
            // Basic check to ensure we have enough columns
            // Note: Rowspans can mess this up, simplified handling here
            if (cols.length <= Math.max(nameIdx, originIdx)) continue;

            const name = cleanText(cols[nameIdx]?.textContent);
            if (!name) continue;

            const origin = originIdx !== -1 ? cleanText(cols[originIdx]?.textContent) : 'Unknown';
            const type = typeIdx !== -1 ? cleanText(cols[typeIdx]?.textContent) : 'Equipment';
            const quantity = quantityIdx !== -1 ? cleanText(cols[quantityIdx]?.textContent) : 'Unknown';
            
            const imgTag = row.querySelector('img');
            const imageUrl = imgTag ? `https:${imgTag.getAttribute('src')}` : `https://picsum.photos/seed/${name.replace(/\s/g, '')}/800/600`;

            assets.push({
                id: `army-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: name,
                origin: origin,
                type: type,
                era: 'Modern',
                branch: 'Army',
                imageUrl: imageUrl,
                description: `${name} is a ${type.toLowerCase()} used by the Indian Army. Origin: ${origin}.`,
                productionCost: 'Unknown',
                upkeepCost: 'Unknown',
                numberInService: quantity,
                specs: {
                    "Origin": origin,
                    "Type": type
                }
            });
        }
    });

    return assets;
};

const parseNavyData = (html: string): MilitaryAsset[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const assets: MilitaryAsset[] = [];
    const tables = doc.querySelectorAll('table.wikitable');

    tables.forEach((table) => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim().toLowerCase() || '');
        
        let nameIdx = -1, classIdx = -1, originIdx = -1, typeIdx = -1;

        headers.forEach((h, i) => {
            if (h.includes('name')) nameIdx = i;
            else if (h.includes('class')) classIdx = i;
            else if (h.includes('origin')) originIdx = i;
            else if (h.includes('type')) typeIdx = i;
        });

        if (nameIdx === -1 && classIdx === -1) return;
        const targetIdx = nameIdx !== -1 ? nameIdx : classIdx;

        const rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.querySelectorAll('td, th');
            
            if (cols.length === 0) continue;

            const name = cleanText(cols[targetIdx]?.textContent);
            if (!name) continue;

            const origin = originIdx !== -1 ? cleanText(cols[originIdx]?.textContent) : 'Unknown';
            const type = typeIdx !== -1 ? cleanText(cols[typeIdx]?.textContent) : 'Ship';
            
            const imgTag = row.querySelector('img');
            const imageUrl = imgTag ? `https:${imgTag.getAttribute('src')}` : `https://picsum.photos/seed/${name.replace(/\s/g, '')}/800/600`;

            assets.push({
                id: `navy-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: name,
                origin: origin,
                type: type,
                era: 'Modern',
                branch: 'Navy',
                imageUrl: imageUrl,
                description: `${name} is a ${type.toLowerCase()} in the Indian Navy. Origin: ${origin}.`,
                productionCost: 'Unknown',
                upkeepCost: 'High',
                numberInService: 'Active',
                specs: {
                    "Origin": origin,
                    "Class": type
                }
            });
        }
    });
    return assets;
};

const parseAirForceData = (html: string): MilitaryAsset[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const assets: MilitaryAsset[] = [];
    const tables = doc.querySelectorAll('table.wikitable');

    tables.forEach((table) => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent?.trim().toLowerCase() || '');
        
        let aircraftIdx = -1, originIdx = -1, roleIdx = -1, quantityIdx = -1;

        headers.forEach((h, i) => {
            if (h.includes('aircraft')) aircraftIdx = i;
            else if (h.includes('origin')) originIdx = i;
            else if (h.includes('role') || h.includes('type')) roleIdx = i;
            else if (h.includes('service') || h.includes('quantity')) quantityIdx = i;
        });

        if (aircraftIdx === -1) return;

        const rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.querySelectorAll('td, th');
            
            if (cols.length <= Math.max(aircraftIdx, originIdx)) continue;

            const name = cleanText(cols[aircraftIdx]?.textContent);
            if (!name) continue;

            const origin = originIdx !== -1 ? cleanText(cols[originIdx]?.textContent) : 'Unknown';
            const role = roleIdx !== -1 ? cleanText(cols[roleIdx]?.textContent) : 'Aircraft';
            const quantity = quantityIdx !== -1 ? cleanText(cols[quantityIdx]?.textContent) : 'Unknown';
            
            const imgTag = row.querySelector('img');
            const imageUrl = imgTag ? `https:${imgTag.getAttribute('src')}` : `https://picsum.photos/seed/${name.replace(/\s/g, '')}/800/600`;

            assets.push({
                id: `af-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
                name: name,
                origin: origin,
                type: role,
                era: 'Modern',
                branch: 'Air Force',
                imageUrl: imageUrl,
                description: `${name} is a ${role.toLowerCase()} used by the Indian Air Force. Origin: ${origin}.`,
                productionCost: 'Unknown',
                upkeepCost: 'High',
                numberInService: quantity,
                specs: {
                    "Origin": origin,
                    "Role": role
                }
            });
        }
    });
    return assets;
};

export const fetchAllAssets = async (): Promise<MilitaryAsset[]> => {
    try {
        const [armyHtml, navyHtml, afHtml] = await Promise.all([
            fetchWikiPage('List_of_equipment_of_the_Indian_Army'),
            fetchWikiPage('List_of_active_Indian_Navy_ships'),
            fetchWikiPage('List_of_active_Indian_military_aircraft')
        ]);

        const armyAssets = parseArmyData(armyHtml);
        const navyAssets = parseNavyData(navyHtml);
        const afAssets = parseAirForceData(afHtml);

        return [...armyAssets, ...navyAssets, ...afAssets];
    } catch (error) {
        console.error("Failed to fetch assets:", error);
        return [];
    }
};
