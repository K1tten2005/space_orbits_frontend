export interface Orbit {
    id: number;
    height: number;
    type: string;
    full_description: string;
    short_description: string;
    image: string | null;
  }

  
  export interface OrbitResult {
    orbits: Orbit[];
  }

  export const getOrbitsByHeight = async (height = ''): Promise<OrbitResult> => {
    const url = `http://127.0.0.1:8000/api/orbits/?orbit_height=${encodeURIComponent(height)}`;
    return fetch(url)
        .then((response) => response.json())
        .then((data) => ({
            orbits: Array.isArray(data.orbits) ? data.orbits : [],
        }));
};

export const getOrbitById = async (orbitId: number | string): Promise<Orbit> => {
    const url = `http://127.0.0.1:8000/api/orbits/${encodeURIComponent(orbitId)}`;
    return fetch(url).then((response) => response.json());
};