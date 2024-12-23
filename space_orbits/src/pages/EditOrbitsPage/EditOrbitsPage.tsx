import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import { fetchOrbits, createOrbit, deleteOrbit } from '../../store/slices/orbitsSlice.ts';
import { T_Orbit } from '../../modules/types.ts';
import './EditOrbitsPage.css';
import { ROUTES } from '../../Routes.tsx';

const EditOrbitsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { orbits } = useAppSelector((state) => state.orbits);
    const [newOrbit, setNewOrbit] = useState<Partial<T_Orbit>>({});
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchOrbits());
    }, [dispatch]);

    const handleAddOrbit = async () => {
            if (!newOrbit.height || !newOrbit.type) {
                setLocalError('Name and Operator Name are required');
                return;
            }

            const orbitData: Omit<T_Orbit, 'id'> = {
                height: newOrbit.height,
                type: newOrbit.type,
                short_description: newOrbit.short_description || '',
                full_description: newOrbit.full_description || '',
                image: newOrbit.image || '',
                active_add: true,
            };

        try {
            await dispatch(createOrbit(orbitData)).unwrap();
                setNewOrbit({});
        } catch (error) {
            setLocalError('Failed to add orbit');
        }
    };

    const handleDeleteOrbit = async (id: number) => {
        try {
            await dispatch(deleteOrbit(id)).unwrap();
        } catch (error) {
            setLocalError('Failed to delete operation');
        }
    };

    const handleNavigateToEdit = (id: number) => {
        navigate(`${ROUTES.EDIT_ORBITS}/${id}`);
    };
    

    return (
        <div className="operations-admin-page">
            <h1>Управление орбитами</h1>
            <table>
                <thead>
                    <tr>
                        <th>Высота</th>
                        <th>Тип</th>
                        <th>Краткое Описание</th>
                        <th>Полное описание</th>
                    </tr>
                </thead>
                <tbody>
                    {orbits.map((orbit) => (
                        <tr key={orbit.id}>
                            <td>{orbit.height}</td>
                            <td>{orbit.type}</td>
                            <td>{orbit.short_description}</td>
                            <td>{orbit.full_description}</td>
                            <td>
                                <button onClick={() => handleNavigateToEdit(orbit.id)}>Редактировать</button>
                                <button className="delete-button" onClick={() => handleDeleteOrbit(orbit.id)}>Удалить</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <h2>Добавить новую орбиту</h2>
                <input
                    type="text"
                    placeholder="Высота"
                    value={newOrbit.height || ''}
                    onChange={(e) => setNewOrbit({ ...newOrbit, height: Number(e.target.value) })}
                />
                <input
                    type="text"
                    placeholder="Тип"
                    value={newOrbit.type || ''}
                    onChange={(e) => setNewOrbit({ ...newOrbit, type: e.target.value })}
                />
                <textarea
                    placeholder="Краткое описание"
                    value={newOrbit.short_description || ''}
                    onChange={(e) => setNewOrbit({ ...newOrbit, short_description: e.target.value })}
                />
                <textarea
                    placeholder="Полное описание"
                    value={newOrbit.full_description || ''}
                    onChange={(e) => setNewOrbit({ ...newOrbit, full_description: e.target.value })}
                />
                <button onClick={handleAddOrbit}>Добавить орбиту</button>
            </div>
        </div>
    );
};

export default EditOrbitsPage;