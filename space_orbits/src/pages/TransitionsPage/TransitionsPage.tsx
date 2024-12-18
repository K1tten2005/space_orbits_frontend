import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import { fetchTransitions, T_TransitionsFilters, updateFilters } from "../../store/slices/transitionsSlice.ts";
import { useNavigate } from "react-router-dom";
import "./TransitionsPage.css";
import { ROUTES } from "../../Routes.tsx";

const TransitionsPage: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const transitions = useAppSelector((state) => state.transitions.transitions);
  const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated);
  const filters = useAppSelector<T_TransitionsFilters>((state) => state.transitions.filters);

  const [status, setStatus] = useState(filters.status);
  const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start);
  const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end);

  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const statusOptions = {
    0: "Любой",
    3: "Сформирован",
    4: "Завершен",
    5: "Отклонен",
  };

  const formatDate = (dateString?: string) => { 
    if (!dateString) return "";   
    const date = new Date(dateString); 
    return date.toLocaleDateString("ru-RU"); // Формат: день.месяц.год 
  }; 

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.PAGE403);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(fetchTransitions());
  }, [dispatch]);

  const applyFilters = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formatDate = (date: string) => {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString();
    };
    const newFilters: T_TransitionsFilters = {
      status,
      date_formation_start: formatDate(dateFormationStart) || '',
      date_formation_end: formatDate(dateFormationEnd) || '',
    };

    await dispatch(updateFilters(newFilters));
    await dispatch(fetchTransitions());
  };

  return (
    <div className="shipments-container">
        <div className="shipments-table-container">
            <form onSubmit={applyFilters} className="shipment-form">
                <div className="shipment-form-group">
                <label>От</label>
                <input
                    type="date"
                    value={dateFormationStart}
                    onChange={(e) => setDateFormationStart(e.target.value)}
                />
                </div>
                <div className="shipment-form-group">
                <label>До</label>
                <input
                    type="date"
                    value={dateFormationEnd}
                    onChange={(e) => setDateFormationEnd(e.target.value)}
                />
                </div>
                <div className="shipment-form-group">
                <label>Статус</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {Object.entries(statusOptions).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                    ))}
                </select>
                </div>
                <div className="shipment-form-group">
                <button type="submit" className="btn btn-outline-dark">
                    Применить
                </button>
                </div>
            </form>

            <div className="table-container">
                {transitions.length > 0 &&
                    <table className="shipments-table">
                        <thead>
                        <tr>
                            <td>ID отправки</td>
                            <td>Статус</td>
                            <td>Дата создания</td>
                            <td>Дата формирования</td>
                            <td>Запланированная дата</td>
                            <td>Дата завершения</td>
                            <td>Создатель</td>
                            <td>Склад</td>
                            <td>Тип операции</td>
                            <td>Номер авто</td>
                        </tr>
                        </thead>
                        <tbody>
                        {transitions.map((transition, index) => (
                            <tr
                            key={index}
                            className={String(transition.id) === hoveredRowId ? "hovered-row" : ""} 
                            onMouseEnter={() => setHoveredRowId(String(transition.id))}
                            onMouseLeave={() => setHoveredRowId(null)}
                            onClick={() => navigate(`${ROUTES.TRANSITIONS}/${transition.id}/`)}
                            >
                            <td>{transition.id}</td>
                            <td>{formatDate(transition.creation_date)}</td>
                            <td>{formatDate(transition.formation_date)}</td>
                            <td>{formatDate(transition.planned_date)}</td>
                            <td>{transition.completion_date}</td>
                            <td>{transition.user}</td>
                            <td>{transition.spacecraft}</td>
                            <td>{transition.planned_date}</td>
                            <td>{transition.planned_time}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                }
            </div>
        </div> 
        {!transitions.length &&
            <h3 className="text-center mt-5">Отправки не найдены</h3>
         }
    </div>
  );
};

export default TransitionsPage;