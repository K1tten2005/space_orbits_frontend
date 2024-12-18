import { FC } from "react";
import { T_Orbit } from "../../modules/types.ts";
import { useAppDispatch } from "../../store/store.ts";
import { removeOrbitFromDraftTransition, updateOrbitPosition } from "../../store/slices/transitionsSlice.ts";
import "./TransitionCard.css";

const defaultImage = './images/default_image.jpg'

interface TransitionCardProps {
  orbit: T_Orbit;
  showRemoveBtn?: boolean;
}

export const TransitionCard: FC<TransitionCardProps> = ({
  orbit,
  showRemoveBtn = false,
}) => {
  const dispatch = useAppDispatch();

  // Уменьшение позиции орбиты
  const handleDecreasePosition = async () => {
    try {
      await dispatch(
        updateOrbitPosition({
          orbit_id: orbit.id.toString(),

        })
      );
    } catch (error) {
      console.error("Ошибка при изменении позиции орбиты:", error);
    }
  };

  // Удаление орбиты
  const handleRemoveFromDraftTransition = async () => {
    try {
      await dispatch(removeOrbitFromDraftTransition(orbit.id.toString()));
    } catch (error) {
      console.error("Ошибка при удалении орбиты:", error);
    }
  };

  return (
    <div className="part-card">
      <img
        className="shipment-part-photo"
        src={orbit.image || defaultImage}
        alt="Orbit Image"
      />
      <div className="shipment-part-details">
        <div className="left-shipment-part-details">
          <h5 className="card-title">{orbit.height} км</h5>
          <p className="card-text">
            <strong>Тип:</strong> {orbit.type}
          </p>
          <p className="card-text">
            <strong>Описание:</strong> {orbit.short_description}
          </p>
        </div>
        <div className="actions-row">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleDecreasePosition}
          >
            Уменьшить позицию
          </button>
          {showRemoveBtn && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleRemoveFromDraftTransition}
            >
              Удалить
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
