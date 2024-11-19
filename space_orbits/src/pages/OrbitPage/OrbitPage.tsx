import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { ORBITS_MOCK } from '../../modules/mock';
import { Orbit, getOrbitById } from '../../modules/spaceOrbitsAPI';
import './OrbitPage.css';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";

const OrbitPage: React.FC = () => {
    const [pageData, setPageData] = useState<Orbit | null>(null); // Инициализация как null

    const { id } = useParams<{ id: string }>(); // Получаем параметр "id" из URL

    useEffect(() => {
        if (!id) return;

        // Запрос данных по ID
        getOrbitById(id)
            .then((response) => setPageData(response))
            .catch(() => {
                // В случае ошибки используем данные из моков
                const fallbackData = ORBITS_MOCK.orbits.find(
                    (orbit) => String(orbit.id) === id
                );
                setPageData(fallbackData || null); // Если нет совпадений, оставить null
            });
    }, [id]);

    // Проверка, что данные загружены
    if (!pageData) {
        return <p>Loading or orbit not found...</p>;
    }

    return (
        <main>
            <BreadCrumbs
          crumbs={[
            { label: ROUTE_LABELS.ORBITS, path: ROUTES.ORBITS },
            { label: "Высота " + pageData?.height.toString() + " км" },
          ]}
        />
            <div className="orbit-details">
                <div className="orbit-image">
                    <img src={pageData.image} alt={`Орбита ${pageData.height} км`} />
                </div>
                <div className="orbit-info">
                    <h2>Высота {pageData.height} км</h2>
                    <p>{pageData.full_description}</p>
                    <p>Тип орбиты: {pageData.type}</p>
                </div>
            </div>
        </main>
    );
};

export default OrbitPage;
