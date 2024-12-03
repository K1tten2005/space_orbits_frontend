import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ORBITS_MOCK } from '../../modules/mock';
import { getOrbitsByHeight, Orbit } from '../../modules/spaceOrbitsAPI';
import './OrbitsPage.css';
import { BreadCrumbs } from '../../components/BreadCrumbs/BreadCrumbs';
import { ROUTES, ROUTE_LABELS } from '../../Routes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const OrbitsPage: React.FC = () => {
  const orbitHeight = useSelector((state: RootState) => state.orbits.height);
  const [orbits, setOrbits] = useState<Orbit[]>(ORBITS_MOCK.orbits);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrbits = async () => {
      setLoading(true);
      try {
        // Если фильтр задан, фильтруем орбиты по высоте
        const response = await getOrbitsByHeight(orbitHeight); 
        setOrbits(response.orbits);
      } catch (error) {
        console.error('Error fetching orbits:', error);
        // Если ошибка, фильтруем по локальным данным
        setOrbits(
          ORBITS_MOCK.orbits.filter((item) =>
            item.height.toString().startsWith(orbitHeight)
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrbits();
  }, [orbitHeight]);

  return (
    <main>
      <SearchBar />
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
          <p>No orbits found.</p>
        )}
      </div>
    </main>
  );
};

export default OrbitsPage;
