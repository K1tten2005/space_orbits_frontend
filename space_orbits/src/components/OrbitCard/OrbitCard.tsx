import { FC } from "react";
import './OrbitCard.css';
import {useAppDispatch, useAppSelector} from "../../store/store.ts";
import {addOrbitToTransition} from "../../store/slices/orbitsSlice.ts";
import { T_Orbit } from "../../modules/types.ts";
const default_image = './images/default_image.jpg'

interface OrbitCardProps {
    orbit: T_Orbit,
    imageClickHandler: () => void
    onAddToDraft: () => void;
}

export const OrbitCard: FC<OrbitCardProps> = ({
    orbit,
    imageClickHandler,
    onAddToDraft,
  }) => {
    const dispatch = useAppDispatch()
  
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
  
    const handeAddToDraftTransition= async (e: React.MouseEvent) => {
      e.stopPropagation(); 
      await dispatch(addOrbitToTransition(orbit.id.toString()));
      onAddToDraft();
    }
  {
    return (
        <div className="orbit-card">
            <img 
            src={orbit.image || default_image} 
            alt={`Орбита ${orbit.height} км`} 
            onClick={imageClickHandler}
            />
            <h3>Высота {orbit.height} км</h3>
            <p>{orbit.short_description}</p>
            <div className="add-section">
          {isAuthenticated ? (
            !orbit.active_add ? (
              <button
                className="btn btn-outline-dark btn-sm min-width-button"
                type="button"
                onClick={handeAddToDraftTransition}>
                Добавить
              </button>
            ) : (
              <button
                className="btn btn-outline-dark btn-sm min-width-button"
                type="button"
                disabled
              >
                Добавлено
              </button>
            )
          ) : null}
            </div>
        </div>
        );
    };
};
export default OrbitCard;