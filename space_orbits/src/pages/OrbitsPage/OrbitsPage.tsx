import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ORBITS_MOCK } from "../../modules/mock";
import { getOrbitsByHeight, Orbit } from "../../modules/spaceOrbitsAPI";
import './OrbitsPage.css';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";

const OrbitsPage: React.FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>(ORBITS_MOCK.orbits);
    const [orbitHeight, setOrbitHeight] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Fetch initial data from the database when the component mounts
    useEffect(() => {
        const fetchOrbits = async () => {
            setLoading(true);
            try {
                const response = await getOrbitsByHeight(''); // Fetch all orbits or modify as needed
                setOrbits(response.orbits);
            } catch (error) {
                console.error('Error fetching orbits:', error);
                // Fall back to mock data if there is an error
                setOrbits(ORBITS_MOCK.orbits);
            } finally {
                setLoading(false);
            }
        };

        fetchOrbits();
    }, []);

    // This function performs the search using orbitHeight
    const handleSearch = () => {
        setLoading(true);

        getOrbitsByHeight(orbitHeight)
            .then((response) => {
                setOrbits(response.orbits);
            })
            .catch(() => {
                // If there is an error during search, fallback to mock data
                setOrbits(
                    ORBITS_MOCK.orbits.filter((item) =>
                        item.height.toString().startsWith(orbitHeight)
                    )
                );
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handle Enter key press for search
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevents form submission
            handleSearch();
        }
    };

    return (
        <main>
            <SearchBar 
                orbitHeight={orbitHeight} 
                setOrbitHeight={setOrbitHeight} 
                onKeyDown={handleKeyDown} // Pass the handler here
            />
            <h2>Орбиты</h2>
            <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.ORBITS, path: ROUTES.ORBITS },
          ]}
        />
            <div className="orbit-container">
                {loading ? (
                    <p>Loading...</p>
                ) : orbits.length > 0 ? (
                    orbits.map((orbit) => (
                        <Link to={`/orbits/${orbit.id}`} className="orbit-link" key={orbit.id}>
                            <OrbitCard orbit={orbit} />
                        </Link>
                    ))
                ) : (
                    <p>No orbits found.</p> // Message when no orbits are found
                )}
            </div>
        </main>
    );
};

export default OrbitsPage;
