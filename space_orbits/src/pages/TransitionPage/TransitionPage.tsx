import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TransitionPage.css';

interface Orbit {
    id: number;
    height: number;
    short_description: string;
    image: string;
}

interface Transition {
    id: number;
    spacecraft: string;
    planned_date: string;
    planned_time: string;
    orbits: Orbit[];
}

const TransitionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [transition, setTransition] = useState<Transition | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchTransition = async () => {
            try {
                const response = await fetch(`/api/transitions/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    setTransition(data);
                } else {
                    setError('Ошибка загрузки данных перехода');
                }
            } catch {
                setError('Ошибка подключения к серверу');
            }
        };

        fetchTransition();
    }, [id]);

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!transition) {
        return <p className="loading">Загрузка...</p>;
    }

    return (
        <div className="transition-page">
            <h1>Составление перехода на орбиты</h1>

            <div className="transition-details">
                <label>
                    <span>Космический аппарат:</span>
                    <input type="text" value={transition.spacecraft} readOnly />
                </label>
                <label>
                    <span>Дата перехода:</span>
                    <input type="text" value={transition.planned_date} readOnly />
                </label>
                <label>
                    <span>Время перехода:</span>
                    <input type="text" value={transition.planned_time} readOnly />
                </label>
            </div>

            <div className="orbits">
                {transition.orbits.map((orbit) => (
                    <div className="orbit-card-transition" key={orbit.id}>
                        <img src={orbit.image} alt={`Орбита ${orbit.height} км`} />
                        <div className="orbit-details">
                            <h2>Высота {orbit.height} км</h2>
                            <p>{orbit.short_description}</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TransitionPage;
