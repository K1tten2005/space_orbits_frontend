import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { getOrbitById, updateOrbit, updateOrbitImage } from '../../store/slices/orbitsSlice.ts';
import { T_Orbit } from '../../modules/types';
import './EditOrbitPage.css';
const default_image = './images/default_image.jpg';

const EditOperationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { is_staff } = useAppSelector((state) => state.user);
  const { orbits } = useAppSelector((state) => state.orbits);
  const [orbit, setOrbit] = useState<T_Orbit | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!is_staff) {
      navigate('/');
    } else if (id) {
      dispatch(getOrbitById(id));
    }
  }, [id, is_staff, navigate, dispatch]);

  useEffect(() => {
    if (orbits.length > 0) {
      setOrbit(orbits[0]);
    }
  }, [orbits]);

  const handleFieldChange = (field: keyof T_Orbit, value: any) => {
    setOrbit((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (orbit) {
      try {
        await dispatch(updateOrbit(orbit)).unwrap();
        navigate(`/orbits/${orbit.id}`);
      } catch (error) {
        setLocalError('Failed to save changes');
      }
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const imageName = await dispatch(updateOrbitImage({ id: orbit!.id.toString(), formData })).unwrap();
          setOrbit((prev) => prev ? { ...prev, photo: imageName } : null);
        dispatch(getOrbitById(id!)); // Refresh operation data
      } catch (error) {
        setLocalError('Failed to update image');
      }
    }
  };

  if (!orbit) return <div>Loading...</div>;
  if (localError) return <div>{localError}</div>;

  return (
    <div className="main-content">

    
    <div className="container-fluid product-container">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="product-operation-container">
            <h1>Редактирование орбиты: Высота {orbit.height} км</h1>
              <div className="product-operations">
                <img
                  src={orbit.image || default_image}
                  alt="Orbit image"
                  className="product-image"
                />
                <input type="file" onChange={handleImageChange} />
                <div className="info">
                  <label htmlFor="operation-name">Высота (в километрах):</label>
                  <input
                    id="operation-name"
                    type="text"
                    value={orbit.height}
                    onChange={(e) => handleFieldChange('height', e.target.value)}
                  />
                  
                  <label htmlFor="operator-name">Тип орбиты:</label>
                  <input
                    id="operator-name"
                    type="text"
                    value={orbit.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                  />
                  
                  <label htmlFor="operation-description">Описание:</label>
                  <textarea
                    id="operation-description"
                    value={orbit.short_description}
                    onChange={(e) => handleFieldChange('short_description', e.target.value)}
                  />

                  <label htmlFor="operation-description">Описание:</label>
                  <textarea
                    id="operation-description"
                    value={orbit.full_description}
                    onChange={(e) => handleFieldChange('full_description', e.target.value)}
                  />
                  <button onClick={handleSaveChanges}>Сохранить изменения</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default EditOperationPage;