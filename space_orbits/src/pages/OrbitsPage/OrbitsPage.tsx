import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrbitCard from '../../components/OrbitCard/OrbitCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { ORBITS_MOCK } from "../../modules/mock";
import { getOrbitsByHeight, Orbit } from "../../modules/spaceOrbitsAPI";
import './OrbitsPage.css';
import { BreadCrumbs } from "../../components/BreadCrumbs/BreadCrumbs";
import { ROUTES, ROUTE_LABELS } from "../../Routes";

export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length); // Убираем пробелы
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const OrbitsPage: React.FC = () => {
    const [orbits, setOrbits] = useState<Orbit[]>([]); // Список орбит
    const [orbitHeight, setOrbitHeight] = useState<string>(''); // Высота для фильтрации
    const [loading, setLoading] = useState(false); // Индикатор загрузки
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false); // Проверка авторизации
    const [userServicesCount, setUserServicesCount] = useState<number>(0); // Количество услуг в корзине
    const [draftTransitionId, setDraftTransitionId] = useState<number | null>(null); // ID черновой заявки

    // Проверка авторизации через cookies
    useEffect(() => {
        const checkLoginStatus = () => {
            const loggedIn = !!getCookie("session_id"); // Проверяем наличие session_id в cookies
            setIsUserLoggedIn(loggedIn);
        };

        checkLoginStatus();
    }, []);

    // Получение данных корзины
    useEffect(() => {
        if (isUserLoggedIn) {
            const fetchUserCartDetails = async () => {
                try {
                    const response = await fetch('/api/orbits'); // Эндпоинт для данных корзины
                    const data = await response.json();
                    setUserServicesCount(data.orbits_to_transfer || 0); // Количество услуг в корзине
                    setDraftTransitionId(data.draft_transition); // ID черновой заявки
                } catch (error) {
                    console.error("Ошибка получения данных корзины:", error);
                    setUserServicesCount(0); // Если ошибка, устанавливаем 0
                    setDraftTransitionId(null); // Если ошибка, сбрасываем ID черновика
                }
            };

            fetchUserCartDetails();
        }
    }, [isUserLoggedIn]); // Запрос выполняется только при авторизации

    // Функция для получения орбит с фильтрацией
    const fetchOrbits = async () => {
        setLoading(true);
        try {
            const response = await getOrbitsByHeight(orbitHeight); // Запрос на сервер
            setOrbits(response.orbits); // Устанавливаем данные из БД
        } catch (error) {
            console.error('Error fetching orbits:', error);
            setOrbits(ORBITS_MOCK.orbits); // Используем мок данные при ошибке
        } finally {
            setLoading(false);
        }
    };

    // Обработка нажатия Enter
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Предотвращаем стандартное поведение
            fetchOrbits(); // Выполняем поиск
        }
    };

    // Первоначальный запрос на получение всех орбит
    useEffect(() => {
        fetchOrbits(); // Загружаем все орбиты при загрузке страницы
    }, []);

    return (
        <main>
            <SearchBar
                orbitHeight={orbitHeight}
                setOrbitHeight={setOrbitHeight}
                onKeyDown={handleKeyDown} // Передаём обработчик Enter
                servicesCount={userServicesCount} // Количество услуг в корзине
                isLoggedIn={isUserLoggedIn} // Статус авторизации
                draftTransitionId={draftTransitionId} // ID черновой заявки
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
                    <p>No orbits found.</p>
                )}
            </div>
        </main>
    );
};

export default OrbitsPage;
