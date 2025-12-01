import requests
from bs4 import BeautifulSoup
import json
import re
import time

# Target URLs
URLS = {
    "Army": "https://en.wikipedia.org/wiki/List_of_equipment_of_the_Indian_Army",
    "Navy": "https://en.wikipedia.org/wiki/List_of_active_Indian_Navy_ships",
    "Air Force": "https://en.wikipedia.org/wiki/List_of_active_Indian_military_aircraft"
}

def clean_text(text):
    if not text:
        return ""
    # Remove references like [1], [a]
    text = re.sub(r'\[.*?\]', '', text)
    return text.strip()

def get_soup(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def scrape_army(soup):
    assets = []
    # Army page usually has tables for different categories
    # We'll look for tables and try to extract relevant columns
    # This is heuristic based on common Wikipedia formats
    
    tables = soup.find_all('table', class_='wikitable')
    
    for table in tables:
        headers = [th.get_text(strip=True) for th in table.find_all('th')]
        
        # Identify relevant columns
        name_idx = -1
        origin_idx = -1
        type_idx = -1
        quantity_idx = -1
        
        for i, h in enumerate(headers):
            h_lower = h.lower()
            if 'model' in h_lower or 'name' in h_lower or 'vehicle' in h_lower or 'weapon' in h_lower:
                name_idx = i
            elif 'origin' in h_lower:
                origin_idx = i
            elif 'type' in h_lower:
                type_idx = i
            elif 'quantity' in h_lower or 'number' in h_lower or 'active' in h_lower:
                quantity_idx = i
        
        if name_idx == -1:
            continue

        rows = table.find_all('tr')[1:] # Skip header
        for row in rows:
            cols = row.find_all(['td', 'th'])
            # Handle rowspans (simplified: just skip or take what's there, handling rowspans correctly is complex)
            # For now, let's just try to get text from the cells we found
            
            if len(cols) <= max(name_idx, origin_idx, type_idx, quantity_idx):
                continue
                
            try:
                name = clean_text(cols[name_idx].get_text())
                origin = clean_text(cols[origin_idx].get_text()) if origin_idx != -1 else "Unknown"
                asset_type = clean_text(cols[type_idx].get_text()) if type_idx != -1 else "Equipment"
                quantity = clean_text(cols[quantity_idx].get_text()) if quantity_idx != -1 else "Unknown"
                
                # Try to find an image in the row or name cell
                img_tag = row.find('img')
                image_url = "https:" + img_tag['src'] if img_tag else f"https://picsum.photos/seed/{name.replace(' ', '')}/800/600"
                
                # Basic filtering
                if not name:
                    continue

                assets.append({
                    "id": re.sub(r'[^a-zA-Z0-9]', '-', name.lower()),
                    "name": name,
                    "origin": origin,
                    "type": asset_type,
                    "era": "Modern", # Assumption
                    "branch": "Army",
                    "imageUrl": image_url,
                    "description": f"{name} is a {asset_type.lower()} used by the Indian Army. Origin: {origin}.",
                    "productionCost": "Unknown",
                    "upkeepCost": "Unknown",
                    "numberInService": quantity,
                    "specs": {
                        "Origin": origin,
                        "Type": asset_type
                    }
                })
            except Exception as e:
                continue
                
    return assets

def scrape_navy(soup):
    assets = []
    tables = soup.find_all('table', class_='wikitable')
    
    for table in tables:
        headers = [th.get_text(strip=True) for th in table.find_all('th')]
        
        name_idx = -1
        origin_idx = -1
        type_idx = -1
        class_idx = -1
        
        for i, h in enumerate(headers):
            h_lower = h.lower()
            if 'name' in h_lower:
                name_idx = i
            elif 'origin' in h_lower:
                origin_idx = i
            elif 'type' in h_lower:
                type_idx = i
            elif 'class' in h_lower:
                class_idx = i
        
        if name_idx == -1 and class_idx == -1:
            continue
            
        target_idx = name_idx if name_idx != -1 else class_idx

        rows = table.find_all('tr')[1:]
        for row in rows:
            cols = row.find_all(['td', 'th'])
            if not cols: continue
            
            try:
                # Navy tables are often: Class | Type | Ships | Origin ...
                # Or: Name | Pennant | Class | Origin ...
                
                # Heuristic: First column is often Class or Name
                name = clean_text(cols[target_idx].get_text()) if target_idx < len(cols) else "Unknown Ship"
                
                origin = "Unknown"
                if origin_idx != -1 and origin_idx < len(cols):
                    origin = clean_text(cols[origin_idx].get_text())
                
                asset_type = "Ship"
                if type_idx != -1 and type_idx < len(cols):
                    asset_type = clean_text(cols[type_idx].get_text())
                
                img_tag = row.find('img')
                image_url = "https:" + img_tag['src'] if img_tag else f"https://picsum.photos/seed/{name.replace(' ', '')}/800/600"

                if not name: continue

                assets.append({
                    "id": re.sub(r'[^a-zA-Z0-9]', '-', name.lower()),
                    "name": name,
                    "origin": origin,
                    "type": asset_type,
                    "era": "Modern",
                    "branch": "Navy",
                    "imageUrl": image_url,
                    "description": f"{name} is a {asset_type.lower()} in the Indian Navy. Origin: {origin}.",
                    "productionCost": "Unknown",
                    "upkeepCost": "High",
                    "numberInService": "Active",
                    "specs": {
                        "Origin": origin,
                        "Class": asset_type
                    }
                })
            except:
                continue
    return assets

def scrape_air_force(soup):
    assets = []
    tables = soup.find_all('table', class_='wikitable')
    
    for table in tables:
        headers = [th.get_text(strip=True) for th in table.find_all('th')]
        
        aircraft_idx = -1
        origin_idx = -1
        type_idx = -1
        quantity_idx = -1
        
        for i, h in enumerate(headers):
            h_lower = h.lower()
            if 'aircraft' in h_lower:
                aircraft_idx = i
            elif 'origin' in h_lower:
                origin_idx = i
            elif 'role' in h_lower or 'type' in h_lower:
                type_idx = i
            elif 'service' in h_lower or 'quantity' in h_lower:
                quantity_idx = i
        
        if aircraft_idx == -1:
            continue

        rows = table.find_all('tr')[1:]
        for row in rows:
            cols = row.find_all(['td', 'th'])
            if len(cols) <= max(aircraft_idx, origin_idx, type_idx):
                continue
            
            try:
                name = clean_text(cols[aircraft_idx].get_text())
                origin = clean_text(cols[origin_idx].get_text()) if origin_idx != -1 else "Unknown"
                role = clean_text(cols[type_idx].get_text()) if type_idx != -1 else "Aircraft"
                quantity = clean_text(cols[quantity_idx].get_text()) if quantity_idx != -1 else "Unknown"
                
                img_tag = row.find('img')
                image_url = "https:" + img_tag['src'] if img_tag else f"https://picsum.photos/seed/{name.replace(' ', '')}/800/600"

                if not name: continue

                assets.append({
                    "id": re.sub(r'[^a-zA-Z0-9]', '-', name.lower()),
                    "name": name,
                    "origin": origin,
                    "type": role,
                    "era": "Modern",
                    "branch": "Air Force",
                    "imageUrl": image_url,
                    "description": f"{name} is a {role.lower()} used by the Indian Air Force. Origin: {origin}.",
                    "productionCost": "Unknown",
                    "upkeepCost": "High",
                    "numberInService": quantity,
                    "specs": {
                        "Origin": origin,
                        "Role": role
                    }
                })
            except:
                continue
    return assets

def main():
    all_assets = []
    
    print("Scraping Army...")
    soup_army = get_soup(URLS["Army"])
    if soup_army:
        all_assets.extend(scrape_army(soup_army))
        
    print("Scraping Navy...")
    soup_navy = get_soup(URLS["Navy"])
    if soup_navy:
        all_assets.extend(scrape_navy(soup_navy))
        
    print("Scraping Air Force...")
    soup_af = get_soup(URLS["Air Force"])
    if soup_af:
        all_assets.extend(scrape_air_force(soup_af))
    
    print(f"Total assets found: {len(all_assets)}")
    
    # Generate TypeScript file content
    ts_content = """import type { MilitaryAsset } from '../types';

export const MOCK_ASSETS: MilitaryAsset[] = """ + json.dumps(all_assets, indent=2) + ";"
    
    with open('services/mockData.ts', 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print("Updated services/mockData.ts")

if __name__ == "__main__":
    main()
